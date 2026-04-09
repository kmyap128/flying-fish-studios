import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './index.css'
import ScenarioScreen from './pages/scenario-screen/page.jsx'
import ResultScreen from './pages/result-screen/page.jsx'
import CharacterSelectionScreen from './pages/character-selection-screen/page.jsx'


function App() {
  const [screen, setScreen] = useState('character-selection');

  return (
    <>
      {screen === 'character-selection' && (
        <CharacterSelectionScreen onComplete={() => setScreen('scenario')} />
      )}
      {screen === 'scenario' && <ScenarioScreen />}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
