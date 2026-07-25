import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CountdownGate from './components/CountdownGate.jsx'

const Gate = import.meta.env.DEV ? ({ children }) => children : CountdownGate;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gate>
      <App />
    </Gate>
  </StrictMode>,
)
