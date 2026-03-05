import { Header } from '../../components/hud-ui/header/header.jsx'
import { ScenarioOption } from '../../components/scenario-ui/scenario-option/scenarioOption.jsx'
import { ScenarioBlock } from '../../components/scenario-ui/scenario-block/scenarioBlock.jsx'
import { Options } from '../../components/scenario-ui/options/options.jsx'
import { Game } from '../../logic/game.js'
import jackalope from '../../media/assets/characters/jackalope.png'
import './page.css'
import { useState, useEffect } from 'react'

export default function ScenarioScreen() {

  const [game] = useState(() => new Game())
  const [scenarioData, setScenarioData] = useState(null)
  const [gameResult, setGameResult] = useState(null)

  const [mode, setMode] = useState('scenario')
  const [countdown, setCountdown] = useState(5)

  // Initialize game once
  useEffect(() => {
    game.onScenarioChange = (data) => {
      setScenarioData(data)
    }

    game.onGameEnd = (result) => {
      setGameResult(result)
    }

    game.loadScenarios().then(() => {
      game.loadCurrentScenario()
    })
  }, [game])

  // Restart countdown every time scenario changes
  useEffect(() => {
    if (!scenarioData) return

    setMode('scenario')
    setCountdown(5)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setMode('options')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [scenarioData])

  const handleSelectOption = (index) => {
    game.selectOption(index)
  }

  const handleLockIn = () => {
    game.endRound()
  }

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: scenarioData
          ? `url(/backgrounds/${scenarioData.scenario.media.background})`
          : 'none'
      }}
    >
      <div id="content-container">

        {gameResult && (
          <h1>{gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}</h1>
        )}

        {!gameResult && mode === 'scenario' && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={'Jackalope'}
              timerStart={5}
              scenarioNumber={game.stage + 1}
            />

            <ScenarioBlock
              title={scenarioData.scenario.name}
              description={scenarioData.scenario.text}
            />
          </>
        )}

        {!gameResult && mode === 'options' && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={'Jackalope'}
              timerStart={10}
              scenarioNumber={game.stage + 1}
            />

            <ScenarioOption
              title={scenarioData.scenario.name}
              description={scenarioData.scenario.text}
            />

            <Options
              options={scenarioData.options.map(o => o[0])}
              onSelect={handleSelectOption}
            />

            <button onClick={handleLockIn}>
              Lock In
            </button>
          </>
        )}

      </div>
    </div>
  )
}