import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import CriarConta from './components/CriarConta'
import CriarContaSteps from './components/CriarContaSteps'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <CriarContaSteps />
    </ChakraProvider>
  </React.StrictMode>
)
