import Link from 'next/link'
import { Content, HeaderContainer, WelcomeContainer } from './styles'
import { ShoppingCart } from 'phosphor-react'
import { ChangeEvent } from 'react'

interface HeaderProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Header({ onChange }: HeaderProps) {
  return (
    <HeaderContainer>
      <Content>
        <WelcomeContainer>
          <div>
            <span>Boas</span>
            <span>Compras</span>
          </div>
          <ShoppingCart size={40} color="#2f56e6" />
        </WelcomeContainer>

        <input
          type="text"
          placeholder="Filtro por nome"
          title="Filtro por nome"
          onChange={onChange}
        />

        <Link href="import">Importar arquivos</Link>
      </Content>
    </HeaderContainer>
  )
}
