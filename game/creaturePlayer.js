import { ITEMS } from "./enums/enums.js";

export class CreaturePlayer {
  constructor(name, species, image, description, item, pedestalIndex) {
    //creature name
    this.name = name;

    this.species = species;
    //creature image
    this.image = image;
    //creature description
    this.description = description;
    //creature item
    this.item = ITEMS[item];
    this.pedestalIndex = pedestalIndex;

    this.isImpostor = false;

    this.choice = null;
    this.disabled = null;
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
    this.choice = null;
  }

  setChoice(choice) {
    this.choice = choice;
  }
}
