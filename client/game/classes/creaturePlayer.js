export class CreaturePlayer {
  constructor(name, image, description, item, injury) {
    //creature name
    this.name = name;
    //creature image
    this.image = image;
    //creature description
    this.description = description;
    //creature item
    this.item = window.ITEMS[item];
    this.injury = injury;
    injury = false;

    this.isImpostor = false;
  }

  //FUNC add/change/remove item
  changeItem(item) {
    this.item = window.ITEMS[item];
  }

  makeImpostor() {
    this.isImpostor = true;
  }
}
