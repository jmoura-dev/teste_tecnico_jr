import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { PrismaPacksRepository } from '@/repositories/prisma/prisma-packs-repository'
import { ValidatedProductsUseCase } from '../validated-products'

export function makeValidatedProductsUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const packsRepository = new PrismaPacksRepository()
  const validatedProductsUseCase = new ValidatedProductsUseCase(
    productsRepository,
    packsRepository,
  )

  return validatedProductsUseCase
}
