import { useEffect, useState } from 'react'
import { api } from './api/api'
import { ImportContainer, SectionContainer } from '@/styles/pages/import'
import { ArrowLeft, CheckCircle, X } from 'phosphor-react'
import Link from 'next/link'

interface ErrorsProps {
  error: string
  code: number
}

interface ProductsToUpdateProps {
  code: number
  name: string
  sales_price: string
  new_price: number
}

export default function Import() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [doesItemSelected, setDoesItemSelected] = useState<boolean>(true)
  const [disableButtonUpdate, setDisableButtonUpdate] = useState<boolean>(true)
  const [openModelProducts, setOpenModelProducts] = useState<boolean>(false)
  const [otherErrors, setOtherErrors] = useState<ErrorsProps[]>([])

  const [productsToUpdate, setProductsToUpdate] = useState<
    ProductsToUpdateProps[]
  >([])
  const [errors, setErrors] = useState<ErrorsProps[]>([])

  useEffect(() => {
    if (errors.length > 0) {
      setOtherErrors(
        errors.filter((itemError) => {
          return itemError.code === 0
        }),
      )
    }
  }, [errors])

  console.log(otherErrors)

  useEffect(() => {
    if (
      errors.length === 0 &&
      productsToUpdate.length > 1 &&
      otherErrors.length === 0
    ) {
      setDisableButtonUpdate(false)
    } else {
      setDisableButtonUpdate(true)
    }
  }, [errors, productsToUpdate, otherErrors])

  useEffect(() => {
    if (selectedFile === null) {
      setDoesItemSelected(true)
    } else {
      setDoesItemSelected(false)
    }
  }, [selectedFile])

  function handleCloseModelProducts() {
    setOpenModelProducts(false)
    setProductsToUpdate([])
    setErrors([])
  }

  async function handleToValidateFile() {
    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      const response = await api.post('products/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setOpenModelProducts(true)
      setProductsToUpdate(response.data.filteredDataProducts)
      setErrors(response.data.errors)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleUpdateProducts() {
    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      await api.put('products/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setProductsToUpdate([])
      setErrors([])
      setSelectedFile(null)
      setOpenModelProducts(false)
      return alert('Produtos atualizados com sucesso!')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ImportContainer>
      <Link href="/">
        {' '}
        <ArrowLeft weight="bold" size={22} /> Voltar
      </Link>

      <div>
        <h2>Upload arquivo csv</h2>

        <input
          type="file"
          placeholder="arquivo"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setSelectedFile(file)
            }
            setDisableButtonUpdate(true)
          }}
        />
      </div>

      <button disabled={doesItemSelected} onClick={handleToValidateFile}>
        Validar arquivo
      </button>

      {openModelProducts && (
        <>
          <SectionContainer>
            <h2>Produtos para atualização</h2>

            <button className="openModel" onClick={handleCloseModelProducts}>
              <X size={25} />
            </button>

            <table>
              <tbody>
                <tr>
                  <td>Código</td>
                  <td>Descrição</td>
                  <td>Preço atual</td>
                  <td>Novo preço</td>
                  <td>Erros</td>
                </tr>
                {productsToUpdate.map((product) => {
                  const erro = errors.find((erro) => erro.code === product.code)

                  return (
                    <tr key={product.code}>
                      <td>{product.code}</td>
                      <td width="30%">{product.name}</td>
                      <td>{product.sales_price}</td>
                      <td>{product.new_price}</td>
                      <td width="30%">
                        {erro ? (
                          <span className="error" key={erro.code}>
                            {erro.error}
                          </span>
                        ) : (
                          <CheckCircle color="green" weight="bold" size={35} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <footer>
              <h2>Outro erros</h2>
              {otherErrors.length > 0 && (
                <ul>
                  {otherErrors.map((erro, index) => {
                    return (
                      <span key={erro.code}>{`${index + 1} - ${
                        erro.error
                      }`}</span>
                    )
                  })}
                </ul>
              )}
            </footer>
          </SectionContainer>
          <button
            title="Botão para atualizar"
            disabled={disableButtonUpdate}
            onClick={handleUpdateProducts}
          >
            Atualizar
          </button>
        </>
      )}
    </ImportContainer>
  )
}
