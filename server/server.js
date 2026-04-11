import EXPRESS from "express";
import HTTP from "http";
import { Server } from "socket.io";
// import ARDUINO_PARSER from "./arduino";
import path from "path";
import fs from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import { Game } from "../game/game.js";
import { SCENARIO_TYPES } from "../game/enums/enums.js";

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

// Single game instance
const game = new Game();
const playerSockets = {};

game.onScenarioChange = (roundData) => {
  io.emit("scenarioChange", {
    round: roundData,
    stage: game.stage,
    wizardsGrasp: game.wizardsGrasp,
  });
  console.log("Category: ", game.currentScenarioCategory);
  console.log("Options: ", game.currentOptions);
};

game.onPlayerChoice = (choiceData) => {
  io.emit("playerChoice", choiceData);
};
game.onModeChange = (mode) => {
  io.emit("modeChange", { newMode: mode });
};
game.onTimerTick = ({ mode, remaining }) => {
  io.emit("timerTick", { mode, remaining });
};
game.onGameEnd = (result) => {
  io.emit("gameEnd", result);
};

const creaturesPath = path.join(__dirname, "../data/creatures.json");
const creaturesData = JSON.parse(fs.readFileSync(creaturesPath, "utf-8"));
game.generateCreatures(creaturesData);
game.assignImpostor();

//Load scenarios and start
const scenariosPath = path.join(__dirname, "../data/scenarios.json");
const scenarioData = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));
game.loadScenarios(scenarioData);
game.loadCurrentScenario();

io.on("connection", (socket) => {
  const takenSlots = Object.keys(playerSockets).map(Number);
  const availableSlot = [0, 1, 2, 3].find((i) => !takenSlots.includes(i));

  if(availableSlot === undefined) {
    socket.emit("lobby", { status: "full" });
    return;
  }

  playerSockets[availableSlot] = socket.id;
  socket.pedestalIndex = availableSlot;

  console.log("🔌 Client connected:", socket.id);

  if (game.currentScenario) {
    socket.emit("scenarioChange", {
      round: game.round,
      stage: game.stage,
      wizardsGrasp: game.wizardsGrasp,
      mode: game.mode,
      timerTick: game.timerTick,
      remaining: game.remaining,
    });
  }
});

// parse arduino data (option selections and button press)
// ARDUINO_PARSER.subscribe("pedestal1", (data) => io.emit("pedestal1Data", data));
// ARDUINO_PARSER.subscribe("pedestal2", (data) => io.emit("pedestal2Data", data));
// ARDUINO_PARSER.subscribe("pedestal3", (data) => io.emit("pedestal3Data", data));
// ARDUINO_PARSER.subscribe("pedestal4", (data) => io.emit("pedestal4Data", data));
if (process.stdin.isTTY) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") process.exit();
    if (keyMap[str]) {
      const { pedestal, position } = keyMap[str];
      const option = positionToOption(position);
      game.registerChoice(pedestal, option);
    }
  });

  console.log("⌨️  Keyboard input active (1/2/3, q/w/e, a/s/d, z/x/c)");
}

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
  const isIndividual =
    game.currentScenarioCategory === "sacrifice" ||
    game.currentScenarioCategory === "item";
  const isDilemma = game.currentScenarioCategory === "dilemma";

  if (isIndividual) {
    return ["option 1", "option 2", "option 3"][position];
  } else if (isDilemma) {
    return ["helpful", null, "selfish"][position];
  } else {
    return ["best", "neutral", "worst"][position];
  }
};

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") process.exit();
  if (keyMap[str]) {
    const { pedestal, position } = keyMap[str];
    const option = positionToOption(position); // evaluated fresh on every keypress
    game.registerChoice(pedestal, option);
  }
});

//console.log("⌨️  Keyboard input active (1/2/3, q/w/e, a/s/d, z/x/c)");

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
