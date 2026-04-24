import { ITEMS } from "./enums/enums.js";

export class CreaturePlayer {
  constructor(pedestalIndex) {
    this.pedestalIndex = pedestalIndex;

    // Set by assignCharacterToPedestal
    this.species = null;
    this.name = null;
    this.heroImage = null;
    this.traitorImage = null;
    this.portrait = null;
    this.nameBoard = null;
    this.infoBlock = null;
    this.description = null;
    this.item = null;

    // Game state
    this.isImpostor = false;
    this.out = false;
    this.injury = false;
    this.choice = null;
    this.disabled = null;
  }

  reset() {
    this.species = null;
    this.name = null;
    this.heroImage = null;
    this.traitorImage = null;
    this.portrait = null;
    this.nameBoard = null;
    this.infoBlock = null;
    this.description = null;
    this.item = null;
    this.isImpostor = false;
    this.out = false;
    this.injury = false;
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

  resetChoice() {
    this.choice = null;
  }

  setChoice(choice) {
    this.choice = choice;
  }
}
