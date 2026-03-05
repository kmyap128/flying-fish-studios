import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ScenarioScreen from './pages/scenario-screen/page.jsx'
import ReviewScreen from './pages/review-screen/page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScenarioScreen />
  </StrictMode>,
)
