import { prisma } from '@/lib/prisma'
import { ProductsRepository } from '../productsRepository'

export class PrismaProductsRepository implements ProductsRepository {
  async fetchManyProducts() {
    const products = await prisma.product.findMany()

    return products
  }

  async findByCode(code: bigint) {
    const product = await prisma.product.findUnique({
      where: {
        code,
      },
      include: {
        pack: true,
      },
    })

    return product
  }

  async updateManyProducts(product_code: bigint, new_price: number) {
    const product = await prisma.product.update({
      where: {
        code: product_code,
      },
      include: {
        pack: true,
      },
      data: {
        sales_price: new_price,
      },
    })

    return product
  }
}
