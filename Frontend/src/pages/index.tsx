import { ProductCard } from '@/components/ProductCard'
import { HomeContainer } from '@/styles/pages/home'
import { useEffect, useState } from 'react'
import { api } from './api/api'
import { Header } from '@/components/Header'

interface ProductsProps {
  name: string
  sales_price: string
}

export default function Home() {
  const [productsArray, setProductsArray] = useState<ProductsProps[]>([])
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    async function fetchProducts() {
      const response = await api.get(`products?query=${search}`)
      setProductsArray(response.data.products)
    }
    fetchProducts()
  }, [search])

  return (
    <HomeContainer>
      <Header onChange={(e) => setSearch(e.target.value)} />
      <header>
        <h1>Shopper</h1>
        <p>Seu supermercado online</p>
      </header>

      <main>
        <ul>
          {productsArray.length > 0 &&
            productsArray.map((product, index) => {
              return (
                <ProductCard
                  name={product.name}
                  key={index}
                  price={String(product.sales_price).padEnd(2, '0')}
                />
              )
            })}
        </ul>
      </main>
    </HomeContainer>
  )
}
