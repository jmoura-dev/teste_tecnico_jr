import { styled, keyframes } from '..'

const topDown = keyframes({
  '0%': { opacity: '0', transform: 'translateY(-360px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' },
})

export const ImportContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  width: '100%',

  div: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',

    input: {
      backgroundColor: '$green300',
      padding: 8,
      cursor: 'pointer',
      border: 'none',
      borderRadius: 4,
      marginBottom: '2rem',
      transition: 'background 0.2s ease',
      width: '20rem',

      '&:hover': {
        backgroundColor: '$green500',
      },
    },
  },
  button: {
    backgroundColor: '$green300',
    padding: 10,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 4,
    marginBottom: '2rem',
    transition: 'background 0.2s ease',
    fontSize: '1.2rem',
    width: '21rem',
    animation: `${topDown} 0.3s linear`,

    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: '#30503A',
      color: '$gray800',
    },

    '&:hover': {
      backgroundColor: '$green500',
    },
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 0.5rem',
    marginTop: '1.5rem',

    tbody: {
      'tr:first-child': {
        color: '$gray300',
      },
    },

    td: {
      padding: '1.25rem 2rem',
      background: '$gray800',

      '&:first-child': {
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
      },

      '&:last-child': {
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      },

      '.error': {
        color: 'red',
      },
    },
  },
})

export const SectionContainer = styled('section', {
  position: 'relative',
  maxHeight: '30rem',
  overflow: 'auto',
  background: '$green500',
  margin: '0 auto 1rem',
  borderRadius: 6,
  padding: '2rem',
  maxWidth: 1000,
  animation: `${topDown} 0.3s linear`,

  '> button': {
    background: 'none',
    width: 10,
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
})
