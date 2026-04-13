import { Header } from "../../components/hud-ui/header/header.jsx";
import { CreatureBar } from "../../components/hud-ui/creature-bar/creatureBar.jsx";
import { WizardBar } from "../../components/hud-ui/wizard-bar/wizardBar.jsx";
import { Timer } from "../../components/hud-ui/timer/timer.jsx";
import { TimerMeter } from "../../components/hud-ui/timer-meter/timerMeter.jsx";
import { ScenarioOption } from "../../components/scenario-ui/scenario-option/scenarioOption.jsx";
import { ScenarioBlock } from "../../components/scenario-ui/scenario-block/scenarioBlock.jsx";
import ScenarioCard from "../../components/scenario-ui/scenario-card/scenarioCard.jsx";
import { Options } from "../../components/scenario-ui/options/options.jsx";
import { ResultBlock } from "../../components/result-ui/result-block/resultBlock.jsx";
import waddles from "/UI_Assets/Corner_UI/Character_UI/Waddles_UI.png";
import "./page.css";

export default function ScenarioScreen({
  socket,
  scenarioData,
  gameResult,
  gameState,
  mode,
  countdown,
  timerDuration,
  optionsOrder,
  myChoice,
  myPlayer,
  roundResult,
}) {
  const handleSelectOption = (key) => {
    socket.emit("selectOption", { optionKey: key });
  };

  const background = scenarioData
    ? `url(/backgrounds/${scenarioData.media.background})`
    : "none";

  const playerImage = myPlayer?.image ? `/characters/${myPlayer.image}` : null;

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
            <div className="header-wrapper">
              <div id="creature-bar-container">
                <CreatureBar image={waddles} creatureName={"Waddles"} />
              </div>
              <div id="wizard-bar-container">
                <WizardBar
                  wizardsGrasp={gameState.wizardsGrasp}
                  scenarioNumber={gameState.stage + 1}
                />
              </div>
            </div>
            <div className="content">
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
            <TimerMeter
              timerCurrent={countdown}
              timerDuration={timerDuration}
            />
          </>
        )}

        {mode === "exiting" && (
          <>
            <div className="header-wrapper">
              <div id="creature-bar-container">
                <CreatureBar image={playerImage} creatureName={myPlayer.name} />
              </div>
              <div id="timer-container">
                <Timer timerCurrent={countdown} />
              </div>
              <div id="wizard-bar-container">
                <WizardBar
                  wizardsGrasp={gameState.wizardsGrasp}
                  scenarioNumber={gameState.stage + 1}
                />
              </div>
            </div>
            <ScenarioBlock
              title={scenarioData.scenarioName}
              description={scenarioData.text}
            />
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <div className="header-wrapper">
              <div id="creature-bar-container">
                <CreatureBar
                  image={playerImage}
                  creatureName={myPlayer?.name}
                />
              </div>
              <div id="timer-container">
                <Timer timerCurrent={countdown} />
              </div>
              <div id="wizard-bar-container">
                <WizardBar
                  wizardsGrasp={gameState.wizardsGrasp}
                  scenarioNumber={gameState.stage + 1}
                />
              </div>
            </div>

            <div className="option-content">
              <ScenarioOption
                title={scenarioData.scenarioName}
                description={scenarioData.text}
              />
            </div>

            <div className="options-container">
              <Options
                options={Object.entries(scenarioData.options)}
                onSelect={(key) => handleSelectOption(key)}
              />
            </div>
          </>
        )}

        {mode === "result" && roundResult && (
          <>
            <ResultBlock
              scenarioNum={gameState.stage + 1}
              resultText={roundResult.winningOption?.[2]}
            />
            <div id="timer-meter-container">
              <TimerMeter
                timerCurrent={countdown}
                timerDuration={timerDuration}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
