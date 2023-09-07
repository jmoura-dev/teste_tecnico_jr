import { prisma } from '@/lib/prisma'
import { PacksRepository } from '../packsRepository'

export class PrismaPacksRepository implements PacksRepository {
  async findByProductId(product_id: bigint) {
    const pack = await prisma.pack.findFirst({
      where: {
        product_id,
      },
      include: {
        product: true,
      },
    })
    return pack
  }
}
