import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { UpdateManyProductsUseCase } from '../updateManyProducts'
import { PrismaPacksRepository } from '@/repositories/prisma/prisma-packs-repository'

export function makeUpdateManyProducts() {
  const productsRepository = new PrismaProductsRepository()
  const packsRepository = new PrismaPacksRepository()
  const updateManyProductsUseCase = new UpdateManyProductsUseCase(
    productsRepository,
    packsRepository,
  )

  return updateManyProductsUseCase
}
