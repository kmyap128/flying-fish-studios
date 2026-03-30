// import { ArduinoController } from "./controllers/ArduinoController";
import { KeyboardController } from "./controllers/KeyboardController";

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
    this.item = window.ITEMS[item];

    this.isImpostor = false;
    this.pedestal = 0;

    this.choice = 0;
  }

  //FUNC add/change/remove item
  changeItem(item) {
    this.item = window.ITEMS[item];
  }

  makeImpostor() {
    this.isImpostor = true;
  }

  removeImpostor() {
    this.isImpostor = false;
  }

  update() {
    // this.choice = ARDUINO_CONTROLLER.getCharacterChoice(this.species);
    this.choice = KEYBOARD_CONTROLLER.getCharacterChoice(this.species);
  }
}
