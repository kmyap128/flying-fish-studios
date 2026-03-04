import { CreaturePlayer } from "./classes/creaturePlayer";
import { ImpostorPlayer } from "./classes/impostorPlayer";
import { Game } from "./classes/game";

let scenarios = JSON.parse(scenarios);

const ARDUINO_CONTROLLER = new ArduinoController();
window.GAME = new Game();

//global variables (window.VARNAME)?
window.NINETAIL_CHOICE;
window.JACKALOPE_CHOICE;
window.DUCKDUCKGOOSE_CHOICE;
window.DINOGON_CHOICE;
//regular variables

let nineTail;
let jackalope;
let duckDuckGoose;
let dinogon;

fetch("/data/scenarios.json")
  .then((res) => res.json())
  .then((data) => {
    creatures = data;

    nineTail = Object.entries(creatures.ntf || null);
    jackalope = Object.entries(creatures.jl || null);
    duckDuckGoose = Object.entries(creatures.ddg || null);
    dinogon = Object.entries(creatures.dg || null);

    startGame();
  });
const NINETAIL = new CreaturePlayer(
  ntf.name,
  ntf.species,
  ntf.image,
  ntf.description,
  ntf.item,
);
const JACKALOPE = new CreaturePlayer(
  jl.name,
  jl.species,
  jl.image,
  jl.description,
  jl.item,
);
const DUCKDUCKGOOSE = new CreaturePlayer(
  ddg.name,
  ddg.species,
  ddg.image,
  ddg.description,
  ddg.item,
);
const DINOGON = new CreaturePlayer(
  dg.name,
  dg.species,
  dg.image,
  dg.description,
  dg.item,
);

const CREATURES = [NINETAIL, JACKALOPE, DUCKDUCKGOOSE, DINOGON];

let nineTailChoice;
let jackalopeChoice;
let duckDuckGooseChoice;
let dinogonChoice;

//FUNC init
function init() {
  let impostor = Math.floor(Math.random() * 4);
  CREATURES[impostor].makeImpostor();

  //trigger state change (to start)
  GAME.stateChange("start");
}

//FUNC update
function update() {
  //get data
  CREATURES.forEach((creature) => {
    creature.update();
  });
  //update game
  GAME.update();
}

//FUNC trigger html event
function triggerEvent() {}
