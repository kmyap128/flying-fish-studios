export class Round {
  constructor(scenario, options, type, media) {
    //time
    this.timeRemaining = 10;
    this.startTime = 10;
    this.elapsed = 0;
    //scenario
    this.scenario = scenario;
    //options
    this.options = options;
    //type
    this.type = SCENARIO_TYPES[type];
    //media
  }

  //FUNC timer countdown
  //FUNC update round
  update() {
    this.elapsed = (millis() - this.startTime) / 1000;

    this.timeRemaining = Math.max(this.startTime - Math.floor(this.elapsed), 0);
  }

  
}
