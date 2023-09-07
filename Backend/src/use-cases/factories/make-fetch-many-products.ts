import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchManyProductsUseCase } from '../fetchManyProducts'

export function makeFetchManyProducts() {
  const productsRepository = new PrismaProductsRepository()
  const fetchManyProductsUseCase = new FetchManyProductsUseCase(
    productsRepository,
  )

  return fetchManyProductsUseCase
}
