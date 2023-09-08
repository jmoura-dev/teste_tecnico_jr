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

  ul: {
    borderRadius: 8,
    cursor: 'pointer',
    position: 'relative',
    maxWidth: '70rem',
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
    gap: '1rem',
    padding: '0 1rem',
    margin: '0 auto',
  },
})
