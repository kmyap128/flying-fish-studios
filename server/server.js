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
game.onGameEnd = (result) => {
  io.emit("gameEnd", result);
};

//Load scenarios and start
const scenariosPath = path.join(__dirname, "../data/scenarios.json");
const scenarioData = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));
game.loadScenarios(scenarioData);

const playerSockets = {};
let gameStarted = false;

const getLobbyState = () => ({
  connectedSlots: Object.keys(playerSockets).map(Number),
  players: game.players.map((p) => ({
    species: p.species,
    name: p.name,
    heroImage: p.heroImage,
    traitorImage: p.traitorImage,
    portrait: p.portrait,
    nameBoard: p.nameBoard,
    infoBlock: p.infoBlock,
    pedestalIndex: p.pedestalIndex,
    hasCharacter: !!p.species,
  })),
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
  if (allConnected && allHaveCharacters) {
    io.emit("allCharactersAssigned");
  }
};

io.on("connection", (socket) => {
  socket.on("requestSlot", (requestedSlot) => {
    const takenSlots = Object.keys(playerSockets).map(Number);

    let assignedSlot;
    if (
      requestedSlot !== null &&
      requestedSlot !== undefined &&
      !takenSlots.includes(requestedSlot)
    ) {
      assignedSlot = requestedSlot;
    } else if (requestedSlot !== null && takenSlots.includes(requestedSlot)) {
      assignedSlot = [0, 1, 2, 3].find((i) => !takenSlots.includes(i));
    } else {
      assignedSlot = [0, 1, 2, 3].find((i) => !takenSlots.includes(i));
    }

    if (assignedSlot === undefined) {
      socket.emit("lobbyFull");
      return;
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

    socket.emit("identity", { pedestalIndex: assignedSlot });

    io.emit("lobby", getLobbyState());

    if (gameStarted && game.currentScenario) {
      socket.emit("scenarioChange", {
        round: game.round,
        stage: game.stage,
        wizardsGrasp: game.wizardsGrasp,
        optionsOrder: game.currentOptionsOrder,
        // mode: game.mode,
        // timerTick: game.timerTick,
        // remaining: game.remaining,
      });
    }

    socket.on("playerReady", () => {
      readyPlayers.add(socket.pedestalIndex);

      if (readyPlayers >= 4 && !gameStarted) {
        game.assignImpostor();
        gameStarted = true;
        console.log("All players ready - starting game");
        io.emit("gameStarting");

        console.log("📡 gameStarting emitted");
        setTimeout(() => game.loadCurrentScenario(), 3000);
      }
    });
  });

  socket.on("disconnect", () => {
    delete playerSockets[socket.pedestalIndex];
    console.log(`Disconnected: pedestal ${socket.pedestalIndex + 1}`);
    io.emit("lobby", getLobbyState());
  });
});

[0, 1, 2, 3].forEach((pedestalIndex) => {
  subscribe(`rfid${pedestalIndex + 1}`, ({ rfidTag, selectedChoice }) => {
    const species = RFID_MAP[rfid];
    if (selectedChoice != 0) {
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
