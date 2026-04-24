import { Header } from "../../components/hud-ui/header/header.jsx";
import { CreatureBar } from "../../components/hud-ui/creature-bar/creatureBar.jsx";
import { WizardBar } from "../../components/hud-ui/wizard-bar/wizardBar.jsx";
import { Timer } from "../../components/hud-ui/timer/timer.jsx";
import { TimerMeter } from "../../components/hud-ui/timer-meter/timerMeter.jsx";
import { ScenarioOption } from "../../components/scenario-ui/scenario-option/scenarioOption.jsx";
import { ScenarioBlock } from "../../components/scenario-ui/scenario-block/scenarioBlock.jsx";
import { Options } from "../../components/scenario-ui/options/options.jsx";
import { ResultBlock } from "../../components/result-ui/result-block/resultBlock.jsx";
import { useRef } from "react";
import "./page.css";
import { NarrationPlayer } from "../../components/scenario-ui/narration/narration.jsx";

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
  myRole,
  myPlayer,
  roundResult,
  narrationDuration,
}) {
  const handleSelectOption = (key) => {
    socket.emit("selectOption", { optionKey: key });
  };

  const background = scenarioData
    ? `url(/backgrounds/${scenarioData.media.background})`
    : null;

  const narration = scenarioData
    ? `/sounds/narrations/${scenarioData.media.sound}`
    : null;

  let narDuration = null;

  const playerName = myPlayer?.name || "Unknown Creature";
  const isImpostor = myRole?.isImpostor ? true : false;
  console.log("impostor", isImpostor);

  return (
    <div
      className={`app-container ${myPlayer?.injury ? "injured" : ""}`}
      style={{
        backgroundImage: scenarioData
          ? `url(/backgrounds/${scenarioData.media.background})`
          : "none",
      }}
    >
      <div id="content-container">
        {!gameResult && mode === "scenario" && scenarioData && (
          <>
            {/* <div className='header'>
              

            </div> */}

            <div className="header-wrapper">
              <div id="creature-bar-container">
                <CreatureBar
                  creatureName={playerName}
                  isImpostor={isImpostor}
                  isInjured={false}
                />
              </div>
              <div id="wizard-bar-container">
                <WizardBar
                  wizardsGrasp={gameState.wizardsGrasp}
                  scenarioNumber={gameState.stage + 1}
                />
              </div>
            </div>
            <div className="content">
              <ScenarioBlock
                title={scenarioData.name}
                description={scenarioData.text}
              />
              <NarrationPlayer url={narration} />
            </div>
            <div className="timer-meter-container">
              <TimerMeter
                timerCurrent={countdown}
                timerDuration={narrationDuration}
              />
            </div>
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <div className="header-wrapper">
              <div id="creature-bar-container">
                <CreatureBar
                  creatureName={playerName}
                  isImpostor={isImpostor}
                  isInjured={false}
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
                options={optionsOrder.map((key) => [
                  key,
                  scenarioData.options[key],
                ])}
                myChoice={myChoice?.choice ?? null}
                onSelect={(key) => handleSelectOption(key)}
              />
            </div>
          </>
        )}

        {mode === "result" && roundResult && (
          <>
            <ResultBlock
              scenarioNum={gameState.stage + 1}
              chosenOption={roundResult.winningChoice[0]}
              resultText={roundResult.resultText}
              countdown={countdown}
              timerDuration={timerDuration}
            />
          </>
        )}
      </div>
    </div>
  );
}
