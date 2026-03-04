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
    this.media = [];
  }

  //FUNC timer countdown
  //FUNC update round
  update() {}
}
