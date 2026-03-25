import EXPRESS from "express";
import HTTP from "http";
import { Server } from "socket.io";
// import ARDUINO_PARSER from "./arduino";
import path from "path";
import fs from "fs";
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
game.onGameEnd = (result) => io.emit("gameEnd", result);

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
    });
  }
});

// parse arduino data (option selections and button press)
// ARDUINO_PARSER.subscribe("pedestal1", (data) => io.emit("pedestal1Data", data));
// ARDUINO_PARSER.subscribe("pedestal2", (data) => io.emit("pedestal2Data", data));
// ARDUINO_PARSER.subscribe("pedestal3", (data) => io.emit("pedestal3Data", data));
// ARDUINO_PARSER.subscribe("pedestal4", (data) => io.emit("pedestal4Data", data));

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
