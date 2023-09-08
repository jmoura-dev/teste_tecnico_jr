import {
  FetchManyProducts,
  ProductsRepository,
} from '@/repositories/productsRepository'

interface ProductType {
  products: FetchManyProducts[]
}

export class FetchManyProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(): Promise<ProductType> {
    console.log('alo')

    const products = await this.productsRepository.fetchManyProducts()

    return {
      products,
    }
  }
}
