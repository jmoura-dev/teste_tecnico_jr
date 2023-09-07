import { Request, Response } from 'express'
import { Readable } from 'stream'
import readLine from 'readline'
import { makeValidatedProductsUseCase } from '@/use-cases/factories/make-validated-products'

export interface ProductsImport {
  product_code: number
  new_price: number
}

export async function validate(request: Request, response: Response) {
  const { file } = request
  const buffer = file?.buffer

  const readableFile = new Readable()
  readableFile.push(buffer)
  readableFile.push(null)

  const productsLine = readLine.createInterface({
    input: readableFile,
  })

  const products: ProductsImport[] = []
  let isFirstLine = true

  for await (const line of productsLine) {
    if (isFirstLine) {
      isFirstLine = false
      continue
    }
    const productLineSplit = line.split(',')
    products.push({
      product_code: Number(productLineSplit[0]),
      new_price: Number(productLineSplit[1]),
    })
  }

  const validatedProducts = makeValidatedProductsUseCase()

  const data = await validatedProducts.execute(products)

  const validateTypeBigint = JSON.stringify(data, (_key, value) =>
    typeof value === 'bigint' ? Number(value) : value,
  )

  return response.status(200).send(validateTypeBigint)
}
