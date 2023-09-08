import { styled } from '../../styles'

export const HeaderContainer = styled('header', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '7rem',
  background: '$green500',
  boxShadow: '0px 0px 20px $green300',
})

export const Content = styled('main', {
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 1280,
  padding: '0 1rem',

  input: {
    padding: 8,
    borderRadius: 4,
    border: 'none',
    outline: 'none',
    maxWidth: '30rem',
    width: '100%',

    '&::placeholder': {
      color: '$gray300',
    },
  },

  '> a': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '$gray300',
    border: 'none',
    borderRadius: 4,
    textDecoration: 'none',
    color: '$gray900',

    '&:hover': {
      backgroundColor: '$gray100',
      cursor: 'pointer',
    },
  },
})

export const WelcomeContainer = styled('div', {
  display: 'flex',
  gap: '0.2rem',
  alignItems: 'center',

  '> div': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
})
