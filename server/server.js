import EXPRESS from "express";
import HTTP from "http";
import { Server } from "socket.io";
// import ARDUINO_PARSER from "./arduino";
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

// Single game instance
const game = new Game();

game.onScenarioChange = (roundData) => {
  io.emit("scenarioChange", {
    round: roundData,
    stage: game.stage,
    wizardsGrasp: game.wizardsGrasp,
  });
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

  const keyMap = {
    1: {
      pedestal: 0,
      option: game.currentType == "synergy" ? "best" : "option 3",
    },
    2: {
      pedestal: 0,
      option: game.currentType == "synergy" ? "neutral" : "option 2",
    },
    3: {
      pedestal: 0,
      option: game.currentType == "synergy" ? "worst" : "option 1",
    },
    q: {
      pedestal: 1,
      option: game.currentType == "synergy" ? "best" : "option 3",
    },
    w: {
      pedestal: 1,
      option: game.currentType == "synergy" ? "neutral" : "option 2",
    },
    e: {
      pedestal: 1,
      option: game.currentType == "synergy" ? "worst" : "option 1",
    },
    a: {
      pedestal: 2,
      option: game.currentType == "synergy" ? "best" : "option 3",
    },
    s: {
      pedestal: 2,
      option: game.currentType == "synergy" ? "neutral" : "option 2",
    },
    d: {
      pedestal: 2,
      option: game.currentType == "synergy" ? "worst" : "option 1",
    },
    z: {
      pedestal: 3,
      option: game.currentType == "synergy" ? "best" : "option 3",
    },
    x: {
      pedestal: 3,
      option: game.currentType == "synergy" ? "neutral" : "option 2",
    },
    c: {
      pedestal: 3,
      option: game.currentType == "synergy" ? "worst" : "option 1",
    },
  };

  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") process.exit();
    if (keyMap[str]) {
      const { pedestal, option } = keyMap[str];
      console.log(
        `⌨️  Key ${str} → pedestal ${pedestal + 1}, option ${option}`,
      );
      game.registerChoice(pedestal, option);
    }
  });

  console.log("⌨️  Keyboard input active (1/2/3, q/w/e, a/s/d, z/x/c)");
}

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
