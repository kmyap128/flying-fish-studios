import { Header } from "../../components/hud-ui/header/header.jsx";
import { ScenarioOption } from "../../components/scenario-ui/scenario-option/scenarioOption.jsx";
import { ScenarioBlock } from "../../components/scenario-ui/scenario-block/scenarioBlock.jsx";
import { Options } from "../../components/scenario-ui/options/options.jsx";
import jackalope from "../../media/assets/characters/jackalope.png";
import "./page.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function ScenarioScreen() {
  const [scenarioData, setScenarioData] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [mode, setMode] = useState("scenario");
  const [gameState, setGameState] = useState({ stage: 0, wizardsGrasp: 0 });

  // Initialize game once
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("scenarioChange", ({ round, stage, wizardsGrasp }) => {
      setScenarioData(round.scenarioData);
      setGameState({ stage, wizardsGrasp });
    });
    socket.on("gameEnd", (result) => {
      setGameResult(result);
    });
    return () => {
      socket.off("connect");
      socket.off("scenarioChange");
      socket.off("gameEnd");
    };
  }, []);

  // Restart countdown every time scenario changes
  useEffect(() => {
    if (!scenarioData) return;

    setMode("scenario");

    const timer = setTimeout(() => {
      setMode("options");
    }, 5000);

    return () => clearTimeout(timer);
  }, [scenarioData]);

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
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerStart={5}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />

            <ScenarioBlock
              title={scenarioData.name}
              description={scenarioData.text}
            />
          </>
        )}

        {!gameResult && mode === "options" && scenarioData && (
          <>
            <Header
              image={jackalope}
              creatureName={"Jackalope"}
              timerStart={10}
              scenarioNumber={gameState.stage + 1}
              wizardsGrasp={gameState.wizardsGrasp}
            />
            <ScenarioOption
              title={scenarioData.name}
              description={scenarioData.text}
            />
            <Options
              options={scenarioData.options.map((o) => o[0])}
              //onSelect={handleSelectOption}
            />
            {/* <button onClick={handleLockIn}>Lock In</button> */}
          </>
        )}
      </div>
    </div>
  );
}
