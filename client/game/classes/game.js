//import players (2-3 instances)
//import imposter (1 instance)
//import round
import { Round } from "./round";

import { CreaturePlayer } from "./creaturePlayer";
import { ImpostorPlayer } from "./impostorPlayer";

export class Game {
  constructor(players, impostor) {
    //CONSTRUCTOR
    //players
    this.players = players;
    //impostor
    this.impostor = impostor;
    //stage
    this.stage = 0;
    //state
    this.state = STATES.START;
    this.round = null;
  }

  update() {
    //update round timer
    if (this.round != null) {
      this.round.update();
    }
    //update check trigger state change
  }

  //FUNC start round
  startRound(scenario, options, type, media) {
    this.round = new Round(scenario, options, type, media);
    this.state = STATES.SCENARIO;
  }

  //FUNC end round?
  endRound() {
    this.stage++;
  }

  //FUNC trigger state change
  stateChange(state) {
    this.state = STATES[state];
  }

  //FUNC assign imposter
  //chose random int between 1-3/1-4 (depending on number of players)
  //assign imposter role (impostor redirect)
}
