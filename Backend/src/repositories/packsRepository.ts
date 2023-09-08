import { Decimal } from '@prisma/client/runtime/library'

export interface PackProps {
  id: bigint
  pack_id: bigint
  product_id: bigint
  qty: bigint
  product?: {
    code: bigint
    name: string
    cost_price: Decimal
    sales_price: Decimal
  }
}

export interface PacksRepository {
  findByProductId(product_id: bigint): Promise<PackProps | null>
}
