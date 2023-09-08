import { ProductsImport } from '@/http/controllers/products/upload-products'
import { PacksRepository } from '@/repositories/packsRepository'
import { ProductsRepository } from '@/repositories/productsRepository'

export class UpdateManyProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private packsRepository: PacksRepository,
  ) {}

  async execute(products: ProductsImport[]) {
    const productsWithCodeBigint = products.map((product) => ({
      ...product,
      product_code: BigInt(product.product_code),
    }))

    const selectedPacks = await Promise.all(
      productsWithCodeBigint.map(async (product) => {
        const packFound = await this.packsRepository.findByProductId(
          product.product_code,
        )
        return packFound
      }),
    )

    const filteredNotNullPacks = selectedPacks.filter((item) => item !== null)
    const newListProductsFiltered = [...productsWithCodeBigint]

    const result = await Promise.all(
      filteredNotNullPacks.map(async (item) => {
        return await this.productsRepository.findByCode(item!.pack_id)
      }),
    )

    const extractedData = result.flatMap((item) => {
      return item?.pack.map((packItem) => ({
        code: item.code,
        salesPrice: item.sales_price,
        id: packItem.product_id,
        qty: packItem.qty,
      }))
    })

    const uniqueIds = [...new Set(extractedData.map((item) => item?.id))]

    const productsToAddNewList = uniqueIds.map((id) => {
      const entry = extractedData.find((item) => item!.id === id)
      if (entry) {
        return {
          code: entry.code,
          salesPrice: entry.salesPrice,
          id: entry.id,
          qty: entry.qty,
        }
      }
      return null
    })

    await Promise.all(
      newListProductsFiltered.map(async (product) => {
        const productsFound = await this.productsRepository.findByCode(
          product.product_code,
        )

        if (!productsFound) {
          return null
        }

        if (productsFound.pack && productsFound.pack.length > 0) {
          const findProduct = newListProductsFiltered.find(
            (item) => item.product_code === productsFound.code,
          )

          const packItems = await Promise.all(
            productsFound.pack.map(async (packItem) => {
              const packProduct = await this.productsRepository.findByCode(
                packItem.product_id,
              )

              const updatePrice =
                Number(productsFound.sales_price) / findProduct!.new_price

              const product_code = packProduct!.code
              const new_price = Number(
                (Number(packProduct?.sales_price) * updatePrice).toFixed(2),
              )

              return { product_code, new_price }
            }),
          )

          newListProductsFiltered.push(...packItems)
        }
        return productsFound
      }),
    )

    await Promise.all(
      productsToAddNewList.map(async (item) => {
        const productsToCompare = await this.productsRepository.findByCode(
          item!.id,
        )
        const secondArrayProductsCompare =
          await this.productsRepository.findByCode(item!.code)

        if (!productsToCompare) {
          throw new Error('Error')
        }

        for (const objectItem of productsToAddNewList) {
          const matchingProduct = secondArrayProductsCompare?.pack.find(
            (packItem) => packItem.product_id === objectItem?.id,
          )
          const newPriceProduct = newListProductsFiltered.find(
            (item) => item.product_code === matchingProduct?.product_id,
          )

          if (matchingProduct) {
            const currentPriceProduct =
              Number(matchingProduct.qty) *
              Number(productsToCompare?.sales_price) // valor atual no pack
            const priceNumber =
              Number(matchingProduct.qty) * Number(newPriceProduct?.new_price)

            console.log(priceNumber)

            const new_price = priceNumber - currentPriceProduct

            newListProductsFiltered.push({
              product_code: item!.code,
              new_price:
                Number(secondArrayProductsCompare!.sales_price) + new_price,
            })
          }
        }
      }),
    )

    const productsArray = await Promise.all(
      newListProductsFiltered.map(
        async (product) =>
          await this.productsRepository.updateManyProducts(
            product.product_code,
            product.new_price,
          ),
      ),
    )

    return {
      productsArray,
    }
  }
}
