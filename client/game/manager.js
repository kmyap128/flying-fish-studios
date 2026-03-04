import { ArduinoController } from "./controllers/ArduinoController";
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
const NINETAIL = new CreaturePlayer("Nine-Tail Fish", "", "", "");
const JACKALOPE = new CreaturePlayer("Jackalope", "", "", "");
const DUCKDUCKGOOSE = new CreaturePlayer("Duck Duck Goose", "", "", "");
const DINOGON = new CreaturePlayer("Dinogon", "", "", "");

let nineTailChoice;
let jackalopeChoice;
let duckDuckGooseChoice;
let dinogonChoice;

//FUNC init
function init() {
  //trigger state change (to start)
  GAME.stateChange("start");
}

//FUNC update
function update() {
  //get data
  nineTailChoice = ARDUINO_CONTROLLER.getCharacter1Choice();
  jackalopeChoice = ARDUINO_CONTROLLER.getCharacter2Choice();
  duckDuckGooseChoice = ARDUINO_CONTROLLER.getCharacter3Choice();
  dinogonChoice = ARDUINO_CONTROLLER.getCharacter4Choice();
  //update game
  GAME.update();
}

//FUNC trigger html event
function triggerEvent() {

}
