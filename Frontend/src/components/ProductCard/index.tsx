import { ProductContainer } from './styles'

interface ProductCardProps {
  name: string
  price: string
}

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <ProductContainer>
      <p>{name}</p>
      <span>{price}</span>
    </ProductContainer>
  )
}
