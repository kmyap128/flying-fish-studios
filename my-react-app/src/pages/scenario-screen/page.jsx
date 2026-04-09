import { Header } from '../../components/hud-ui/header/header.jsx'
import { ScenarioOption } from '../../components/scenario-ui/scenario-option/scenarioOption.jsx'
import { ScenarioBlock } from '../../components/scenario-ui/scenario-block/scenarioBlock.jsx'
import ScenarioCard from '../../components/scenario-ui/scenario-card/scenarioCard.jsx'
import { Options } from '../../components/scenario-ui/options/options.jsx'
import { ResultBlock } from '../../components/result-ui/result-block/resultBlock.jsx'
import jackalope from '../../media/assets/characters/jackalope.png'
import './page.css'

export default function ScenarioScreen({
    socket,
    scenarioData,
    gameResult,
    gameState,
    mode,
    countdown,
    timerDuration,
  }) {
    const handleSelectOption = (optionIndex) => {
      socket.emit("selectOption", { optionIndex });
    };

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
              timerCurrent={countdown}
              timerDuration={timerDuration}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />
            <div className='content'>
              {/* <ScenarioCard
                title={scenarioData.name}
                description={scenarioData.text}
                variant="block"
              /> */}
              <ScenarioBlock
                title={scenarioData.name}
                description={scenarioData.text}
              />
            </div>
          </>
        )}

        {mode === 'exiting' && (
          <>
          <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerCurrent={countdown}
              timerDuration={timerDuration}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />
          <ScenarioBlock title={scenarioData.scenarioName} description={scenarioData.text} />
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerCurrent={countdown}
              timerDuration={timerDuration}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />

            <div className='content'>
              <ScenarioOption title={scenarioData.scenarioName} description={scenarioData.text} />
            </div>

            <Options
              options={Object.entries(scenarioData.options)}
              onSelect={(key) => handleSelectOption(key)}
            />
          </>
        )}

        {mode === 'result' && scenarioData && selectedOption && (
          <ResultBlock scenarioNum={gameState.stage + 1} resultText={selectedOption[2]} />
        )}

      </div>
    </div>
  );
}
