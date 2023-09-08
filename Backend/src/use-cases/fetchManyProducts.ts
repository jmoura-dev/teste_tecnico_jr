import {
  FetchManyProducts,
  ProductsRepository,
} from '@/repositories/productsRepository'

interface ProductType {
  products: FetchManyProducts[]
}

interface FetchManyProductsUseCaseRequest {
  query?: string
}

export class FetchManyProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    query,
  }: FetchManyProductsUseCaseRequest): Promise<ProductType> {
    const products = await this.productsRepository.fetchManyProducts(query)

    return {
      products,
    }
  }
}
