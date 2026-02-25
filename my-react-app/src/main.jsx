import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ScenarioScreen from './scenario-screen/page.jsx'
import OptionsScreen from './options-screen/page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OptionsScreen />
  </StrictMode>,
)
