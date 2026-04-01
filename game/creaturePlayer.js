// import { ArduinoController } from "./controllers/ArduinoController.js";
import { KeyboardController } from "./controllers/KeyboardController.js";
import { ITEMS } from "./enums/enums.js";
// const ARDUINO_CONTROLLER = new ArduinoController();
const KEYBOARD_CONTROLLER = new KeyboardController();

export class CreaturePlayer {
  constructor(name, species, image, description, item) {
    //creature name
    this.name = name;

    this.species = species;
    //creature image
    this.image = image;
    //creature description
    this.description = description;
    //creature item
    this.item = ITEMS[item];
    this.pedestal = 0;

    this.isImpostor = false;

    this.choice = null;
  }

  //FUNC add/change/remove item
  changeItem(item) {
    this.item = ITEMS[item];
  }

  makeImpostor() {
    this.isImpostor = true;
  }

  removeImpostor() {
    this.isImpostor = false;
  }

  resetChoice() {
    this.choice = 0;
  }

  setChoice(choice) {
    this.choice = choice;
  }
}
