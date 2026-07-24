import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CountdownGate from './components/CountdownGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CountdownGate>
      <App />
    </CountdownGate>
  </StrictMode>,
)
