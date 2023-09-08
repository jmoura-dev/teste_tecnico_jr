import { styled } from '..'

export const HomeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  width: '100%',

  'header:nth-child(2)': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '3rem auto',
    color: '$green300',
    marginBottom: '3rem',

    h1: {
      fontSize: '3rem',
    },
  },
})
