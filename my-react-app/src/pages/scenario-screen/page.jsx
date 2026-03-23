import { Header } from "../../components/hud-ui/header/header.jsx";
import { ScenarioOption } from "../../components/scenario-ui/scenario-option/scenarioOption.jsx";
import { ScenarioBlock } from "../../components/scenario-ui/scenario-block/scenarioBlock.jsx";
import { Options } from "../../components/scenario-ui/options/options.jsx";
import { Manager } from "../../logic/manager.js";
import jackalope from "../../media/assets/characters/jackalope.png";
import "./page.css";
import { useState, useEffect } from "react";

export default function ScenarioScreen() {
  // Initialize game once
  useEffect(() => {
    Manager.setTransitions();
  }, [Manager]);

  // Restart countdown every time scenario changes
  useEffect(() => {
    Manager.setInterval();
  }, [Manager.scenarioData]);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: scenarioData
          ? `url(/backgrounds/${scenarioData.scenario.media.background})`
          : "none",
      }}
    >
      <div id="content-container">
        {gameResult && (
          <h1>{gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}</h1>
        )}

        {!gameResult && mode === "scenario" && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerStart={5}
              scenarioNumber={game.stage + 1}
              wizardsGrasp={game.wizardsGrasp}
            />

            <ScenarioBlock
              title={scenarioData.scenario.name}
              description={scenarioData.scenario.text}
            />
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerStart={10}
              scenarioNumber={game.stage + 1}
              wizardsGrasp={game.wizardsGrasp}
            />

            <ScenarioOption
              title={scenarioData.scenario.name}
              description={scenarioData.scenario.text}
            />

            <Options
              options={scenarioData.options.map((o) => o[0])}
              onSelect={handleSelectOption}
            />

            <button onClick={handleLockIn}>Lock In</button>
          </>
        )}
      </div>
    </div>
  );
}
