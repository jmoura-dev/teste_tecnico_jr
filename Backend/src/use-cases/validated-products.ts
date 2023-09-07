import { ProductsImport } from '@/http/controllers/products/validated-products'
import { ProductsRepository } from '@/repositories/productsRepository'

interface ErrorsProps {
  error: string
  code: number
}

interface ArrayDuplicateProps {
  product_code: bigint
  new_price: number
}

export class ValidatedProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(products: ProductsImport[]) {
    const productsWithCodeBigint = products.map((product) => ({
      ...product,
      product_code: BigInt(product.product_code),
    }))

    const errors: ErrorsProps[] = []
    const newListProductsFiltered = [...productsWithCodeBigint]

    const arrayItemsFound = await Promise.all(
      newListProductsFiltered.map(async (product) => {
        const itemFound = await this.productsRepository.findByCode(
          product.product_code,
        )

        if (!itemFound) {
          return null
        }

        return itemFound
      }),
    )

    const newArrayProductsWithDataUpdated = newListProductsFiltered.map(
      (product) => {
        const matchingProductDatabase = arrayItemsFound.find(
          (productDatabase) =>
            productDatabase?.code === BigInt(product.product_code),
        )
        if (matchingProductDatabase) {
          return {
            code: matchingProductDatabase.code,
            name: matchingProductDatabase.name,
            sales_price: matchingProductDatabase.sales_price,
            new_price: product.new_price,
          }
        }

        return null
      },
    )

    const filteredDataProducts = newArrayProductsWithDataUpdated.filter(
      (item) => item !== null,
    )

    await Promise.all(
      newListProductsFiltered.map(async (product) => {
        const productsFound = await this.productsRepository.findByCode(
          product.product_code,
        )

        if (!productsFound) {
          errors.push({
            error: `Produto código ${product.product_code} não existente.`,
            code: 0,
          })
          return null
        }

        const costPrice = Number(productsFound.cost_price)
        const currentPrice = Number(productsFound.sales_price)
        const newPrice = Number(product.new_price)

        const upperLimit = currentPrice * 1.1
        const lowerLimit = currentPrice * 0.9

        if (newPrice < costPrice) {
          errors.push({
            error: 'Preço de venda não pode ser inferior ao de compra',
            code: Number(productsFound.code),
          })
        }

        if (newPrice < lowerLimit || newPrice > upperLimit) {
          errors.push({
            error:
              'O reajuste não pode ser maior ou menor que 10% do valor atual',
            code: Number(productsFound.code),
          })
        }

        if (productsFound.pack && productsFound.pack.length > 0) {
          const packItems = await Promise.all(
            productsFound.pack.map(async (packItem) => {
              const packProduct = await this.productsRepository.findByCode(
                packItem.product_id,
              )
              if (!packProduct) {
                errors.push({
                  error: 'Produto no pack não encontrado.',
                  code: 0,
                })
              }

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

    function findDuplicateProductCodes(array: ArrayDuplicateProps[]): string[] {
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

    const duplicateProductCodes = findDuplicateProductCodes(
      newListProductsFiltered,
    )

    if (Object.keys(duplicateProductCodes).length > 0) {
      console.log(duplicateProductCodes)
      errors.push({
        error: `Não é possível modificar o item duas vezes ao mesmo tempo. OBS(Basta modificar o valor unitário e o pacote se ajustará. O contrário também é válido). Itens unitários que se repetem: ${duplicateProductCodes}`,
        code: 0,
      })
    }

    return { filteredDataProducts, errors }
  }
}
