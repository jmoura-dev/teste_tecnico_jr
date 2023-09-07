import { Request, Response } from 'express'
import { Readable } from 'stream'
import readLine from 'readline'
import { makeUpdateManyProducts } from '@/use-cases/factories/make-update-many-products'

export interface ProductsImport {
  product_code: number
  new_price: number
}

export async function upload(request: Request, response: Response) {
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

  try {
    const updateManyProducts = makeUpdateManyProducts()

    const result = await updateManyProducts.execute(products)

    const arrayProducts = JSON.stringify(result, (_key, value) =>
      typeof value === 'bigint' ? Number(value) : value,
    )

    return response.status(200).send(arrayProducts)
  } catch (err) {
    if (err instanceof Error) {
      return response.status(404).send({ message: err.message })
    }

    throw err
  }
}
