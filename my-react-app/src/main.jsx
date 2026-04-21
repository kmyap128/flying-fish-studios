import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";
import ScenarioScreen from "./pages/scenario-screen/page.jsx";
import CharacterSelectionScreen from "./pages/character-selection-screen/page.jsx";
import LobbyScreen from "./pages/lobby-screen/page.jsx";

const socket = io("http://localhost:3000");

function App() {
  const [screen, setScreen] = useState("character-selection");
  const [myPedestalIndex, setMyPedestalIndex] = useState(null);
  const [lobbyState, setLobbyState] = useState({
    status: "waiting",
    connectedSlots: [],
    players: [],
  });

  const [scenarioData, setScenarioData] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [gameState, setGameState] = useState({ stage: 0, wizardsGrasp: 0 });
  const [mode, setMode] = useState("scenario");
  const [countdown, setCountdown] = useState(5);
  const [timerDuration, setTimerDuration] = useState(5);
  const [optionsOrder, setOptionsOrder] = useState([]);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [roundResult, setRoundResult] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      const storedSlot = localStorage.getItem("pedestalIndex");
      const requestedSlot = storedSlot !== null ? Number(storedSlot) : null;

      socket.emit("requestSlot", requestedSlot);
    });

    socket.on("identity", ({ pedestalIndex }) => {
      setMyPedestalIndex(pedestalIndex);

      localStorage.setItem("pedestalIndex", pedestalIndex);
      console.log(`I am pedestal ${pedestalIndex + 1}`);
    });

    socket.on("lobby", (data) => {
      setLobbyState(data);
    });

    socket.on("lobbyFull", (data) => {
      console.warn("Lobby is full");
    });

    socket.on("gameStarting", () => {
      setTimeout(() => setScreen("scenario"), 3000);
    });

    socket.on(
      "scenarioChange",
      ({ round, stage, wizardsGrasp, optionsOrder }) => {
        setScenarioData(round.scenarioData);
        setGameState({ stage, wizardsGrasp });
        setOptionsOrder(optionsOrder);
        setRoundResult(null);
        setPlayerChoices([]);
        setGameResult(null);
      },
    );

    socket.on("playerChoice", ({ choices }) => {
      setPlayerChoices(choices);
    });

    socket.on("roundResult", (resultData) => {
      setRoundResult(resultData);
      setPlayerChoices(resultData.playerChoices);
    });

    socket.on("modeChange", ({ newMode }) => {
      setMode(newMode);
      if (newMode === "scenario") setTimerDuration(5);
      if (newMode === "options") setTimerDuration(10);
      if (newMode === "result") setTimerDuration(5);
    });
    socket.on("timerTick", ({ remaining }) => setCountdown(remaining));
    socket.on("gameEnd", (result) => setGameResult(result));

    return () => {
      socket.off("connect");
      socket.off("identity");
      socket.off("lobby");
      socket.off("lobbyFull");
      socket.off("gameStarting");
      socket.off("scenarioChange");
      socket.off("playerChoice");
      socket.off("roundResult");
      socket.off("modeChange");
      socket.off("timerTick");
      socket.off("gameEnd");
    };
  }, []);

  const myPlayer =
    myPedestalIndex !== null ? lobbyState.players?.[myPedestalIndex] : null;

  const myChoice =
    playerChoices.find((p) => p.pedestalIndex === myPedestalIndex) ?? null;

  const handleCharacterSelectComplete = (selectedCharacters) => {
    socket.emit("startGame", { selectedCharacters });
    setScreen("scenario");
  };

  return (
    <>
      {screen === "character-selection" && (
        <CharacterSelectionScreen
          onComplete={handleCharacterSelectComplete}
          myPlayer={myPlayer}
        />
      )}
      {screen === "lobby" && (
        <LobbyScreen
          lobbyState={lobbyState}
          myPedestalIndex={myPedestalIndex}
        />
      )}
      {screen === "scenario" && (
        <ScenarioScreen
          socket={socket}
          scenarioData={scenarioData}
          gameResult={gameResult}
          gameState={gameState}
          mode={mode}
          countdown={countdown}
          timerDuration={timerDuration}
          optionsOrder={optionsOrder}
          myChoice={myChoice}
          myPlayer={myPlayer}
          roundResult={roundResult}
        />
      )}
      {/* )} */}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
