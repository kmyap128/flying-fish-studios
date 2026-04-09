import { Header } from '../../components/hud-ui/header/header.jsx'
import { ScenarioOption } from '../../components/scenario-ui/scenario-option/scenarioOption.jsx'
import { ScenarioBlock } from '../../components/scenario-ui/scenario-block/scenarioBlock.jsx'
import ScenarioCard from '../../components/scenario-ui/scenario-card/scenarioCard.jsx'
import { Options } from '../../components/scenario-ui/options/options.jsx'
import { ResultBlock } from '../../components/result-ui/result-block/resultBlock.jsx'
import { Game } from '../../logic/game.js'
import jackalope from '../../media/assets/characters/jackalope.png'
import './page.css'
import { useState, useEffect } from 'react'

const socket = io("http://localhost:3000");

export default function ScenarioScreen() {
  const [scenarioData, setScenarioData] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [mode, setMode] = useState("scenario");
  const [gameState, setGameState] = useState({ stage: 0, wizardsGrasp: 0 });
  const [countdown, setCountdown] = useState(5);

  // Initialize game once
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("scenarioChange", ({ round, stage, wizardsGrasp }) => {
      setScenarioData(round.scenarioData);
      setGameState({ stage, wizardsGrasp });
    });
    socket.on("modeChange", ({ mode }) => {
      setMode(newMode);
    });
    socket.on("timerTick", ({ remaining }) => {
      setCountdown(remaining);
    });
    socket.on("gameEnd", (result) => {
      setGameResult(result);
    });
    return () => {
      socket.off("connect");
      socket.off("scenarioChange");
      socket.off("gameEnd");
      socket.off("modeChange");
      socket.off("timerTick");
    };
  }, []);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: scenarioData
          ? `url(/backgrounds/${scenarioData.media.background})`
          : "none",
      }}
    >
      <div id="content-container">
        {gameResult && (
          <h1>{gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}</h1>
        )}

        {!gameResult && mode === "scenario" && scenarioData && (
          <>
            {/* <div className='header'>
              

            </div> */}
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerStart={countdown}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />
            <div className='content'>
              {/* <ScenarioCard
                title={scenarioData.scenario.name}
                description={scenarioData.scenario.text}
                variant="block"
              /> */}
              <ScenarioBlock
                title={scenarioData.scenario.name}
                description={scenarioData.scenario.text}
              />
            </div>
          </>
        )}

        {mode === 'exiting' && (
          <>
          <Header
              image={jackalope}
              creatureName={'Jackalope'}
              timerStart={15}
              scenarioNumber={game.stage + 1}
              wizardsGrasp={game.wizardsGrasp}
            />
          <ScenarioBlock title={scenarioData.scenarioName} description={scenarioData.scenario.text} />
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={'Jackalope'}
              timerStart={15}
              scenarioNumber={game.stage + 1}
              wizardsGrasp={game.wizardsGrasp}
            />

            <div className='content'>
              <ScenarioOption title={scenarioData.scenarioName} description={scenarioData.scenario.text} />
            </div>

            <Options
              options={scenarioData.options}
              onSelect={handleSelectOption}
            />
            {/* <button onClick={handleLockIn}>Lock In</button> */}
          </>
        )}

        {mode === 'result' && scenarioData && selectedOption && (
          <ResultBlock scenarioNum={game.stage + 1} resultText={selectedOption[2]} />
        )}

      </div>
    </div>
  );
}
