//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./index.css";
import ScenarioScreen from "./pages/scenario-screen/page.jsx";
import CharacterSelectionScreen from "./pages/character-selection-screen/page.jsx";
import EndingScreen from "./pages/ending-screen/page.jsx";

const socket = io("http://localhost:3000");
let slotAlreadyRequested = false;

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
  const [allTapped, setAllTapped] = useState(false);

  //const slotRequested = useRef(false);

  useEffect(() => {
    // socket.once("connect", () => {
    //   console.log("✅ Socket connected:", socket.id);
    //   console.log("slotAlreadyRequested:", slotAlreadyRequested); // add this

    //   const params = new URLSearchParams(window.location.search);
    //   const requestedSlot = params.has("pedestal")
    //     ? Number(params.get("pedestal")) - 1
    //     : null;
    //   socket.emit("requestSlot", requestedSlot);
    // });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected — resetting slot request flag");

      slotAlreadyRequested = false;
    });

    socket.on("allCharactersAssigned", () => setAllTapped(true));

    socket.on("identity", ({ pedestalIndex }) => {
      setMyPedestalIndex(pedestalIndex);

      console.log(`I am pedestal ${pedestalIndex + 1}`);
    });

    socket.on("lobby", (data) => {
      setLobbyState(data);
    });

    socket.on("lobbyFull", (data) => {
      console.warn("Lobby is full");
    });

    socket.on("gameStarting", () => {
      //setTimeout(() => setScreen("scenario"), 3000);
      setGameResult(null);
      setScreen("scenario");
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
    socket.on("gameEnd", ({ result, isImpostor }) => {
      setScreen("end");
      setGameResult({ result, isImpostor });
    });

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
      socket.off("disconnect");
      socket.off("allCharactersAssigned");
    };
  }, []);

  useEffect(() => {
    socket.on("fullRestart", () => {
      console.log("🔄 fullRestart received on client");
      setGameResult(null);
      setRoundResult(null);
      setPlayerChoices([]);
      setScenarioData(null);
      setGameState({ stage: 0, wizardsGrasp: 0 });
      setMode("scenario");
      setCountdown(5);
      setOptionsOrder([]);
      setLobbyState({
        status: "waiting",
        connectedSlots: [],
        players: [],
      });
      setScreen("character-selection");
      console.log("🔄 fullRestart received in main.jsx — reloading");
      window.location.reload();
    });

    return () => socket.off("fullRestart");
  }, []);

  useEffect(() => {
    const requestSlot = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedSlot = params.has("pedestal")
        ? Number(params.get("pedestal")) - 1
        : null;
      socket.emit("requestSlot", requestedSlot);
    };

    if (socket.connected) {
      requestSlot();
    } else {
      socket.once("connect", requestSlot);
    }

    return () => socket.off("connect", requestSlot);
  }, []);

  const allPlayers = lobbyState.players ?? [];
  console.log(allPlayers);

  const myPlayer =
    myPedestalIndex !== null ? allPlayers?.[myPedestalIndex] : null;

  const myChoice =
    playerChoices.find((p) => p.pedestalIndex === myPedestalIndex) ?? null;

  const handleCharacterSelectComplete = (selectedCharacters) => {
    console.log("✅ handleCharacterSelectComplete called");
    socket.emit("startGame", { selectedCharacters });
    setScreen("scenario");
  };

  return (
    <>
      {screen === "character-selection" && (
        <CharacterSelectionScreen
          onComplete={handleCharacterSelectComplete}
          myPlayer={myPlayer}
          socket={socket}
          allTapped={allTapped}
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
      {screen === "end" && gameResult && (
        <EndingScreen gameResult={gameResult} players={lobbyState.players} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
