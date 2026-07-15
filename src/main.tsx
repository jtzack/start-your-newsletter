import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import * as Fathom from 'fathom-client'
import './index.css'
import App from './App.tsx'

function Root() {
  useEffect(() => {
    Fathom.load('UCNVPYFA', { spa: 'auto' })
  }, [])
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
