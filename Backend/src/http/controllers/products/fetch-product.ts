import { makeFetchManyProducts } from '@/use-cases/factories/make-fetch-many-products'
import { Request, Response } from 'express'
import { z } from 'zod'

export async function products(request: Request, response: Response) {
  const CreateQuerySchema = z.object({
    query: z.string().default(''),
  })

  const { query } = CreateQuerySchema.parse(request.query)

  try {
    const fetchManyProductsUseCase = makeFetchManyProducts()
    const products = await fetchManyProductsUseCase.execute({ query })

    const arrayProducts = JSON.stringify(products, (_key, value) =>
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
