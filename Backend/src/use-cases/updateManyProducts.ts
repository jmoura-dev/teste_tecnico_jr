import { ProductsImport } from '@/http/controllers/upload-products'
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

    const errors: string[] = []
    const selectedPacks = await Promise.all(
      productsWithCodeBigint.map(async (product) => {
        const packFound = await this.packsRepository.findByProductId(
          product.product_code,
        )
        return packFound
      }),
    )
    const filteredNotNullPacks = selectedPacks.filter((item) => item !== null)
    const newListProductsFiltered = [...products]
    let currentProduct

    for (const obj of filteredNotNullPacks) {
      if (obj) {
        const codeProduct = Number(obj.product!.code) // código do produto
        const qty = Number(obj.qty)

        // Encontre o índice produto atual na lista de produtos
        const productIndex = newListProductsFiltered.findIndex(
          (item) => item.product_code === codeProduct,
        )
        if (productIndex !== -1) {
          currentProduct = newListProductsFiltered[productIndex]
          newListProductsFiltered.splice(productIndex, 1)
        }

        const new_price = Number(
          String((currentProduct!.new_price * qty).toFixed(2)),
        )
        const product_code = Number(obj.pack_id)

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
          errors.push(
            `Produto com o código ${product.product_code} não encontrado.`,
          )
          return null
        }

        const costPrice = Number(productsFound.cost_price)
        const currentPrice = Number(productsFound.sales_price)
        const newPrice = Number(product.new_price)

        const upperLimit = currentPrice * 1.1
        const lowerLimit = currentPrice * 0.9

        if (newPrice < costPrice) {
          errors.push(
            `Preço de venda não pode ser inferior ao de compra. CÓDIGO DO ITEM: ${productsFound?.code}`,
          )
        }

        if (newPrice < lowerLimit || newPrice > upperLimit) {
          errors.push(
            `O reajuste não pode ser maior ou menor que 10% do valor atual. CÓDIGO DO ITEM: ${productsFound.code}`,
          )
        }

        if (productsFound.pack && productsFound.pack.length > 0) {
          const totalPriceProduct = Number(productsFound.sales_price)
          const packItems = await Promise.all(
            productsFound.pack.map(async (packItem) => {
              const packProduct = await this.productsRepository.findByCode(
                packItem.product_id,
              )
              if (!packProduct) {
                errors.push(
                  `Produto no pack com o código ${packItem.product_id} não encontrado.`,
                )
              }
              const product_code = Number(packProduct!.code)
              const new_price = Number(
                (Number(totalPriceProduct) / Number(packItem.qty)).toFixed(2),
              )

              return { product_code, new_price }
            }),
          )

          newListProductsFiltered.push(...packItems)
        }

        return productsFound
      }),
    )

    function findDuplicateProductCodes(array: ProductsImport[]): string[] {
      // Verifica se existem produtos repetidos no update
      const seenProductCodes = new Set()
      const duplicateProductCodes: string[] = []

      for (const item of array) {
        const productCode = item.product_code

        if (seenProductCodes.has(productCode)) {
          if (!duplicateProductCodes.includes(String(productCode))) {
            duplicateProductCodes.push(String(productCode))
          }
        } else {
          seenProductCodes.add(productCode)
        }
      }

      return duplicateProductCodes
    }

    const duplicateProductCodes = findDuplicateProductCodes(products)

    if (Object.keys(duplicateProductCodes).length > 0) {
      errors.push(
        `Não é possível modificar o itens duas vezes ao mesmo tempo, CÓDIGO DOS ITENS DUPLICADOS: ${duplicateProductCodes.join(
          ', ',
        )}`,
      )
    }

    if (errors.length > 0) {
      const errorMessages = errors.join('; ')

      throw new Error(errorMessages)
    }

    const productsArray = Promise.all(
      newListProductsFiltered.map((product) =>
        this.productsRepository.updateManyProducts(
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
