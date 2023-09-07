import { Decimal } from '@prisma/client/runtime/library'

export interface ProductsProps {
  code: bigint
  name: string
  cost_price: Decimal
  sales_price: Decimal
  pack: {
    id: bigint
    pack_id: bigint
    product_id: number
    qty: bigint
  }[]
}

export interface FetchManyProducts {
  code: bigint
  name: string
  cost_price: Decimal
  sales_price: Decimal
}

export interface ProductsRepository {
  fetchManyProducts(): Promise<FetchManyProducts[]>
  findByCode(code: number): Promise<ProductsProps | null>
  updateManyProducts(
    product_code: number,
    new_price: number,
  ): Promise<ProductsProps>
}
