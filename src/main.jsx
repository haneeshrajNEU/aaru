import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CountdownGate from './components/CountdownGate.jsx'
import PasswordGate from './components/PasswordGate.jsx'

const Passthrough = ({ children }) => children;
const OuterGate = import.meta.env.DEV ? Passthrough : PasswordGate;
const TimeGate = import.meta.env.DEV ? Passthrough : CountdownGate;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OuterGate>
      <TimeGate>
        <App />
      </TimeGate>
    </OuterGate>
  </StrictMode>,
)
