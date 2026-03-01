export class ImpostorPlayer {
  constructor(name, image, description, item) {
    //creature name
    this.name = name;
    //creature image
    this.image = image;
    //creature description
    this.description = description;
    //creature item
    this.item = ITEMS[item];
  }

  //FUNC add/change/remove item
  changeItem(item) {
    this.item = ITEMS[item];
  }
}
