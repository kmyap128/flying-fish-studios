import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ScenarioScreen from './pages/scenario-screen/page.jsx'
import ResultScreen from './pages/result-screen/page.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScenarioScreen />    
    {/* <ResultScreen /> */}
  </StrictMode>,
)
