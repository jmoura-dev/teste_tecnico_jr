import { styled } from '@/styles'

export const ProductContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 15,
  height: '15rem',
  minWidth: '12rem',
  maxWidth: '13rem',
  backgroundColor: '$green300',
  fontSize: '$xl',
  borderRadius: 6,

  p: {
    margin: '-2rem 0 2rem',
  },
})
