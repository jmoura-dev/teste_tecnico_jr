import { ProductContainer } from './styles'

interface ProductCardProps {
  name: string
  price: string
  className: string
}

export function ProductCard({ name, price, className }: ProductCardProps) {
  return (
    <ProductContainer className={className}>
      <p>{name}</p>
      <span>{price}</span>
    </ProductContainer>
  )
}
