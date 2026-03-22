export class KeyboardController {
  constructor() {
    this.p1Character = "Nine-Tail";
    this.p1Choice = 0;

    this.p2Character = "Jackalope";
    this.p2Choice = 0;

    this.p3Character = "Duck-Duck-Goose";
    this.p3Choice = 0;

    this.p4Character = "Dinogon";
    this.p4Choice = 0;

    document.addEventListener("keydown", (e) => {
      if (e.key == "1") {
        this.p1Choice = 1;
      }
      if (e.key == "2") {
        this.p1Choice = 2;
      }
      if (e.key == "3") {
        this.p1Choice = 3;
      }
      if (e.key == "0") {
        this.p1Choice = 0;
      }

      if (e.key == "q") {
        this.p2Choice = 1;
      }
      if (e.key == "w") {
        this.p2Choice = 2;
      }
      if (e.key == "e") {
        this.p2Choice = 3;
      }
      if (e.key == "p") {
        this.p2Choice = 0;
      }

      if (e.key == "a") {
        this.p3Choice = 1;
      }
      if (e.key == "s") {
        this.p3Choice = 2;
      }
      if (e.key == "d") {
        this.p3Choice = 3;
      }
      if (e.key == "l") {
        this.p3Choice = 0;
      }

      if (e.key == "z") {
        this.p4Choice = 1;
      }
      if (e.key == "x") {
        this.p4Choice = 2;
      }
      if (e.key == "c") {
        this.p4Choice = 3;
      }
      if (e.key == "m") {
        this.p4Choice = 0;
      }
    });
  }

  getCharacterChoice(species) {
    if (species == this.p1Character) {
      return {
        selectedCharacter: this.p1Character,
        selectedChoice: this.p1Choice,
      };
    } else if (species == this.p2Character) {
      return {
        selectedCharacter: this.p2Character,
        selectedChoice: this.p2Choice,
      };
    } else if (species == this.p3Character) {
      return {
        selectedCharacter: this.p3Character,
        selectedChoice: this.p3Choice,
      };
    } else if (species == this.p4Character) {
      return {
        selectedCharacter: this.p4Character,
        selectedChoice: this.p4Choice,
      };
    }
  }
}
