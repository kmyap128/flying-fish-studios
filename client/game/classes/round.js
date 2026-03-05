export class Round {
  constructor(scenario, options, type, media) {
    //time
    this.timeRemaining = this.totalTime;
    this.totalTime = 10;
    this.countdown = null;
    //scenario
    this.scenario = scenario;
    //options
    this.options = options;
    //type
    this.type = SCENARIO_TYPES[type];
    //media
  }

  //FUNC timer countdown
  startTimer(timerElement, circle, onTimeUp) {
    this.timeRemaining = this.totalTime;

    timerElement.textContent = this.timeRemaining;
    circle.style.background = `conic-gradient(#bb0000 360deg, #222 0deg)`;

    if (this.countdown) {
      clearInterval(this.countdown);
    }

    this.countdown = setInterval(() => {
      this.timeRemaining--;

      timerElement.textContent = this.timeRemaining;

      let progress = (this.timeRemaining / this.totalTime) * 360;
      circle.style.background = `conic-gradient(#bb0000 ${progress}deg, #222 0deg)`;

      if (this.timeRemaining <= 0) {
        clearInterval(this.countdown);
        
        if (onTimeUp){
          onTimeUp();
        }
      }
    }, 1000);
  }

  //FUNC stop timer
  stopTimer() {
    if (this.countdown) {
    clearInterval(this.countdown);
    }
  }

  //FUNC update round
  update() {
    this.elapsed = (millis() - this.startTime) / 1000;

    this.timeRemaining = Math.max(this.startTime - Math.floor(this.elapsed), 0);
  }


}
