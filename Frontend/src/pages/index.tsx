import { HomeContainer } from '@/styles/pages/home'
import { useState } from 'react'
import { api } from './api/api'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function handleToSendFile() {
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
    }

    const response = await api.patch('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response.data)
  }

  return (
    <HomeContainer>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setSelectedFile(file)
          }
        }}
      />
      <button onClick={handleToSendFile}>Enviar Arquivo</button>
    </HomeContainer>
  )
}
