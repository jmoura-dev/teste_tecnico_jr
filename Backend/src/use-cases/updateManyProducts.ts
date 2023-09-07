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
    let currentProduct

    for await (const obj of filteredNotNullPacks) {
      if (obj) {
        const codeProduct = Number(obj.product!.code) // código do produto
        const qty = Number(obj.qty)

        // Encontre o índice produto atual na lista de produtos
        const productIndex = newListProductsFiltered.findIndex(
          (item) => item.product_code === BigInt(codeProduct),
        )
        if (productIndex !== -1) {
          currentProduct = newListProductsFiltered[productIndex]
          newListProductsFiltered.splice(productIndex, 1)
        }

        const new_price = Number(
          String((currentProduct!.new_price * qty).toFixed(2)),
        )
        const product_code = obj.pack_id

        newListProductsFiltered.push({
          product_code,
          new_price,
        })
      }
    }

    await Promise.all(
      newListProductsFiltered.map(async (product) => {
        const productsFound = await this.productsRepository.findByCode(
          product.product_code,
        )

        if (!productsFound) {
          return null
        }

        if (productsFound.pack && productsFound.pack.length > 0) {
          const packItems = await Promise.all(
            productsFound.pack.map(async (packItem) => {
              const packProduct = await this.productsRepository.findByCode(
                packItem.product_id,
              )

              let totalPrice
              const arrayProductsFound = [{ ...productsFound }]

              for (const productItem of arrayProductsFound) {
                const code = Number(productItem.code)
                const matchingItem = newListProductsFiltered.find(
                  (item) => item.product_code === BigInt(code),
                )
                if (matchingItem) {
                  totalPrice = matchingItem.new_price
                }
              }

              const product_code = packProduct!.code
              const new_price = Number(
                (Number(totalPrice) / Number(packItem.qty)).toFixed(2),
              )

              return { product_code, new_price }
            }),
          )

          newListProductsFiltered.push(...packItems)
        }
        return productsFound
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
