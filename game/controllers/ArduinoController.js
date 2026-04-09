//socket instance
const socket = io();

export class ArduinoController {
  constructor() {
    this.creature1Data = {};
    this.creature2Data = {};
    this.creature3Data = {};
    this.creatuer4Data = {};

    socket.on("pedestal1", (data) => {
      this.creature1Data = data;
    });

    socket.on("pedestal2", (data) => {
      this.creature2Data = data;
    });

    socket.on("pedestal3", (data) => {
      this.creature3Data = data;
    });

    socket.on("pedestal4", (data) => {
      this.creature4Data = data;
    });
  }

  //FUNC get choice (4 instances, one for each creature)
  getCharacter1Choice() {
    return this.creature1Data;
  }
  getCharacter2Choice() {
    return this.creature2Data;
  }
  getCharacter3Choice() {
    return this.creature3Data;
  }
  getCharacter4Choice() {
    return this.creature4Data;
  }

  //FUNC get button press (4 instances, one for each creature)?
}
