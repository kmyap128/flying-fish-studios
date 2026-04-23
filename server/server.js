import EXPRESS from "express";
import HTTP, { get } from "http";
import { Server } from "socket.io";
import { subscribe } from "./arduino.js";
import path from "path";
import fs from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import { Game } from "../game/game.js";

// ESM file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Usage: node ./server/server.js --pedestals
const autoAssignPedestals = process.argv.includes("--pedestals");

const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);
const io = new Server(SERVER, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || process.env.NODE_PORT || 3000;

APP.use(EXPRESS.static("client"));
APP.use("/media", EXPRESS.static("media"));
APP.use("/data", EXPRESS.static(path.join(__dirname, "../data")));

const RFID_MAP = {
  "TAG-001": "Nine-Tailed Fish",
  "TAG-002": "Jackalope",
  "TAG-003": "Duck Duck Goose",
  "TAG-004": "Dinogon",
};
// Single game instance
const game = new Game();

const readyPlayers = new Set();
let characterDisplayTimer;

game.onScenarioChange = (roundData) => {
  io.emit("scenarioChange", {
    round: roundData,
    stage: game.stage,
    wizardsGrasp: game.wizardsGrasp,
    optionsOrder: game.currentOptionsOrder,
  });
  console.log("Category: ", game.currentScenarioCategory);
  console.log("Options: ", game.currentOptions);
};

game.onModeChange = (mode) => {
  io.emit("modeChange", { newMode: mode });
};
game.onTimerTick = ({ mode, remaining }) => {
  io.emit("timerTick", { mode, remaining });
};
game.onPlayerChoice = (choiceData) => {
  io.emit("playerChoice", choiceData);
};
game.onRoundResult = (resultData) => {
  io.emit("roundResult", resultData);
  io.emit("modeChange", { newMode: "result" });
};
game.onGameEndPlayer = (result) => {
  game.players.forEach((p) => {
    if (!p.isImpostor) {
      const socketId = playerSockets[p.pedestalIndex];
      if (socketId)
        io.to(socketId).emit("gameEnd", { result, isImpostor: false });
    }
  });
};
game.onGameEndImpostor = (result) => {
  const impostor = game.players.find((p) => p.isImpostor);
  if (impostor) {
    const socketId = playerSockets[impostor.pedestalIndex];
    if (socketId) io.to(socketId).emit("gameEnd", { result, isImpostor: true });
  }
};

//Load scenarios and start
const scenariosPath = path.join(__dirname, "../data/scenarios.json");
const scenarioData = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));
game.loadScenarios(scenarioData);

const playerSockets = {};
let gameStarted = false;

const getLobbyState = () => ({
  connectedSlots: Object.keys(playerSockets).map(Number),
  players: game.players.map((p) => ({ ...p })),
  status:
    Object.keys(playerSockets).length === 4 &&
    game.players.every((p) => p.species)
      ? "ready"
      : "waiting",
});

const tryStartGame = () => {
  if (gameStarted) return;
  const allConnected = Object.keys(playerSockets).length === 4;
  const allHaveCharacters = game.players.every((p) => p.species);
  console.log(
    `🔍 tryStartGame: connected=${allConnected} (${Object.keys(playerSockets).length}/4), characters=${allHaveCharacters}`,
  );
  if (allConnected && allHaveCharacters) {
    game.assignImpostor();
    console.log("📡 Emitting allCharactersAssigned");
    io.emit("allCharactersAssigned");
    console.log("All characters assigned — starting character display");

    characterDisplayTimer = setTimeout(() => {
      if (!gameStarted) {
        gameStarted = true;
        console.log("Character display complete — starting game");
        io.emit("gameStarting");
        setTimeout(() => game.loadCurrentScenario(), 3000);
      }
    }, 10000);
  }
};

io.on("connection", (socket) => {
  socket.on("requestSlot", (requestedSlot) => {
    if (requestedSlot === null || requestedSlot === undefined) {
      socket.emit("lobbyFull");
      return;
    }

    const takenByLiveSocket = Object.entries(playerSockets).some(
      ([slot, id]) => Number(slot) === requestedSlot && id !== socket.id,
    );

    if (takenByLifeSocket) {
      socket.emit("lobbyFull");
      return;
    }

    playerSockets[requestedSlot] = socket.id;
    socket.pedestalIndex = requestedSlot;

    const takenSlots = Object.keys(playerSockets).map(Number);

    let assignedSlot;
    if (
      requestedSlot !== null &&
      requestedSlot !== undefined &&
      !takenSlots.includes(requestedSlot)
    ) {
      assignedSlot = requestedSlot;
    } else {
      assignedSlot = [0, 1, 2, 3].find((i) => !takenSlots.includes(i));

      if (assignedSlot === undefined) {
        assignedSlot = [0, 1, 2, 3].find((i) => !takenSlots.includes(i));
      }
    }

    if (assignedSlot === undefined) {
      socket.emit("lobbyFull");
      return;
    }

    playerSockets[assignedSlot] = socket.id;
    socket.pedestalIndex = assignedSlot;

    console.log(
      `🔌 Client connected: ${socket.id} -> pedestal ${assignedSlot + 1}`,
    );

    if (autoAssignPedestals && !game.players[assignedSlot].species) {
      game.assignCharacterToPedestal(assignedSlot, DEV_RFID[assignedSlot]);
      console.log(
        `🎮 Auto-assigned ${DEV_RFID[assignedSlot]} to pedestal ${assignedSlot + 1}`,
      );
    }

    socket.emit("identity", { pedestalIndex: assignedSlot });
    socket.emit("lobby", getLobbyState());
    io.emit("lobby", getLobbyState());

    tryStartGame();

    if (gameStarted && game.currentScenario) {
      socket.emit("scenarioChange", {
        round: game.round,
        stage: game.stage,
        wizardsGrasp: game.wizardsGrasp,
        optionsOrder: game.currentOptionsOrder,
      });
    }
  });

  socket.on("playerReady", () => {
    readyPlayers.add(socket.pedestalIndex);
    console.log(`✅ Ready count: ${readyPlayers.size}/4`);

    if (readyPlayers.size >= 4 && !gameStarted) {
      game.assignImpostor();
      gameStarted = true;
      console.log("All players ready - starting game");
      io.emit("gameStarting");
      setTimeout(() => game.loadCurrentScenario(), 3000);
    }
  });

  socket.on("disconnect", () => {
    if (socket.pedestalIndex === undefined) return;
    const slot = socket.pedestalIndex;

    delete playerSockets[slot];
    console.log(`Disconnected: pedestal ${slot + 1}`);
    io.emit("lobby", getLobbyState());
  });
});

[0, 1, 2, 3].forEach((pedestalIndex) => {
  subscribe(`rfid${pedestalIndex + 1}`, ({ rfidTag, selectedChoice }) => {
    const species = RFID_MAP[rfidTag];
    if (selectedChoice != 0) {
      console.log(species, "registered");
      game.assignCharacterToPedestal(pedestalIndex, species);
      io.emit("lobby", getLobbyState());
      tryStartGame();
    }
  });
});

[0, 1, 2, 3].forEach((pedestalIndex) => {
  subscribe(`pedestal${pedestalIndex + 1}`, ({ selectedChoice }) => {
    const optionKey = game.currentOptionsOrder[selectedChoice - 1];
    if (!optionKey) return;
    game.registerChoice(pedestalIndex, optionKey);
  });
});

const keyMap = {
  1: { pedestal: 0, position: 0 },
  2: { pedestal: 0, position: 1 },
  3: { pedestal: 0, position: 2 },
  q: { pedestal: 1, position: 0 },
  w: { pedestal: 1, position: 1 },
  e: { pedestal: 1, position: 2 },
  a: { pedestal: 2, position: 0 },
  s: { pedestal: 2, position: 1 },
  d: { pedestal: 2, position: 2 },
  z: { pedestal: 3, position: 0 },
  x: { pedestal: 3, position: 1 },
  c: { pedestal: 3, position: 2 },
};

const positionToOption = (position) => {
  return game.currentOptionsOrder[position] ?? null;
};

const DEV_RFID = [
  "Nine-Tailed Fish",
  "Jackalope",
  "Duck Duck Goose",
  "Dinogon",
];

if (process.stdin.isTTY) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") process.exit();

    if (str === "r") {
      DEV_RFID.forEach((species, i) => {
        game.assignCharacterToPedestal(i, species);
      });
      io.emit("lobby", getLobbyState());
      console.log("🪪 Dev: all RFID taps simulated");
      tryStartGame();
      return;
    }

    if (str === "g") {
      [0, 1, 2, 3].forEach((i) => readyPlayers.add(i));
      if (!gameStarted) {
        game.assignImpostor();
        gameStarted = true;
        io.emit("gameStarting");
        setTimeout(() => game.loadCurrentScenario(), 3000);
        console.log("🎮 Dev: game force started");
      }
      return;
    }

    if (str === "t") {
      console.log("🔄 Full game restart...");

      // Reset game state
      game.stage = 0;
      game.currentCategoryIndex = 0;
      game.wizardsGrasp = 0;
      game.currentScenario = null;
      game.currentOptions = null;
      game.currentOptionsOrder = [];
      game.currentType = null;
      game.currentScenarioCategory = null;
      game.round = null;
      game.chosen = [false, false, false, false];
      game.resultText = "";
      game.players.forEach((p) => {
        p.reset();
      clearInterval(game.timerInterval);

      if (characterDisplayTimer) {
        clearTimeout(characterDisplayTimer);
        characterDisplayTimer = null;
      }

      // Reset server state
      readyPlayers.clear();
      gameStarted = false;

      io.emit("lobby", getLobbyState());

      // Tell all clients to go back to character selection
      io.emit("fullRestart");
      console.log("🔄 Full restart complete");

      return;
    }

    if (keyMap[str]) {
      const { pedestal, position } = keyMap[str];
      const option = positionToOption(position);
      game.registerChoice(pedestal, option);
    }
  });

  console.log("⌨️  Keyboard input active (1/2/3, q/w/e, a/s/d, z/x/c)");
}

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
