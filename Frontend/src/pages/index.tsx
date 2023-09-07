import { HomeContainer } from '@/styles/pages/home'
import { useState } from 'react'
import { api } from './api/api'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState('')

  async function handleToSendFile() {
    const formData = new FormData()
    formData.append('file', selectedFile)

    const response = await api.patch('/upload', formData)
    console.log(response.data)
  }

  return (
    <HomeContainer>
      {/* <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /> */}
      <button onClick={handleToSendFile}>Enviar Arquivo</button>
    </HomeContainer>
  )
}
