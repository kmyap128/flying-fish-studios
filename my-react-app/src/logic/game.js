import { Round } from "./round.js";
import { STATES } from "./enums/enums.js";

export class Game {
  constructor() {
    //CONSTRUCTOR
    //players
    // this.players = players;
    // //impostor
    // this.impostor = impostor;
    this.state = STATES.START;
    // stage 
    this.stage = 0;
    this.currentCategoryIndex = 0;
    this.wizardsGrasp = 0;

    this.allScenarios = null;
    this.scenarioFlow = [];

    this.currentScenario = null;
    this.currentOptions = null;
    this.currentType = null;

    // Callbacks (React will assign these)
    this.onScenarioChange = null;
    this.onGameEnd = null;
  }

  // update() {
  //   //update round timer
  //   if (this.round != null) {
  //     this.round.update();
  //   }
  //   //update check trigger state change
  // }

  async loadScenarios() {
    const res = await fetch("/data/scenarios.json");
    const data = await res.json();

    this.allScenarios = data;

    // this.obstacleScenarios = Object.entries(data.obstacle || {});
    // this.combatScenarios = Object.entries(data.combat || {});
    // this.itemScenarios = Object.entries(data.item || {});
    // this.sacrificeScenarios = Object.entries(data.sacrifice || {});
    // this.bonusScenarios = Object.entries(data.bonus || {});
    // this.dilemmaScenarios = Object.entries(data.dilemma || {});

    // this.scenarioFlow = [
    //   () => this.obstacleScenarios,
    //   () => this.combatScenarios,
    //   () => this.itemScenarios,
    //   () => this.sacrificeScenarios,
    //   () => this.bonusScenarios,
    //   () => this.dilemmaScenarios
    // ];

    this.scenarioFlow = [
      Object.entries(data.obstacle || {}),
      Object.entries(data.combat || {}),
      Object.entries(data.item || {}),
      Object.entries(data.sacrifice || {}),
      Object.entries(data.bonus || {}),
      Object.entries(data.dilemma || {})
    ];
  }

  //  //FUNC start round
  //   startRound(scenario, options, type, media) {
  //     this.round = new Round(scenario, options, type, media);
  //     this.state = STATES.SCENARIO;
  //     this.currentOptions = options;
  //     this.currentType = type;
  
  //     document.getElementById("scenario-name").textContent = scenario.name;
  //     document.getElementById("scenario").textContent = scenario.text;
  
  //     this.optionButtons.forEach((button, index) => {
  //       if (index < options.length) {
  //         button.style.display = "inline-block";
  //         button.textContent = options[index][0];
  //         button.disabled = false;
  //         button.classList.remove("selected");
  //       } else {
  //         button.style.display = "none";
  //       }
  //     });
  
  //     this.selectedOption = null;
  //     this.lockInButton.disabled = true;
  
  //     this.round.startTimer(
  //       this.timerElement,
  //       this.circle,
  //       () => this.showTimeUpLoseScreen()
  //     );
  //   }

  //FUNC load current scenario
  loadCurrentScenario() {
    if (this.currentCategoryIndex >= this.scenarioFlow.length) {
      this.endGame("win");
      return;
    }

    const currentCategory = this.scenarioFlow[this.currentCategoryIndex];

    if (!currentCategory || currentCategory.length === 0) {
      this.currentCategoryIndex++;
      this.loadCurrentScenario();
      return;
    }

    const randomIndex = Math.floor(Math.random() * currentCategory.length);
    const [scenarioName, scenarioData] = currentCategory[randomIndex];

    const options = Object.values(scenarioData.options);

    this.currentScenario = {
      name: scenarioName,
      text: scenarioData.scenario,
      media: {
        background: scenarioData.background,
        sound: scenarioData.sound,
        images: scenarioData.images,
        animation: scenarioData.animation
      }
    };

    this.currentOptions = options;
    this.currentType = scenarioData.type;
    this.state = STATES.SCENARIO;

    if (this.onScenarioChange) {
      this.onScenarioChange({
        scenario: this.currentScenario,
        options: options,
        type: this.currentType
      });
    }
  }

  selectOption(index) {
    this.selectedOptionIndex = index;
  }

  //FUNC end round?
  endRound() {
    if (this.currentType !== "item") {
      const value = this.currentOptions[this.selectedOptionIndex]?.[1];

      if (typeof value === "number") {
        this.wizardsGrasp += value;
      }
    }

    // Lose Condition
    if (this.wizardsGrasp >= 3) {
      this.endGame("lose");
      return;
    }

    this.stage++;
    this.currentCategoryIndex++;
    this.loadCurrentScenario();
  }

  endGame(result) {
    this.state = STATES.END;

    if (this.onGameEnd) {
      this.onGameEnd(result); // "win" or "lose"
    }
  }

  // //FUNC win screen
  //   showWinScreen() {
  //     document.getElementById("scenario-name").textContent = "FREEDOM!!!";
  //     document.getElementById("scenario").textContent = "YOU SUCCESSFULLY MADE IT BACK HOME!! :DDDDDDD";
  
  //     this.optionButtons.forEach(btn => btn.style.display = "none");
  //     this.lockInButton.style.display = "none";
  
  //     clearInterval(this.round.countdown);
  //   }
  
  //   //FUNC lose screen
  //   showLoseScreen() {
  //     document.getElementById("scenario-name").textContent = "YOU LOSE!!!";
  //     document.getElementById("scenario").textContent = "YOU GOT CAPTURED BY THE WIZARD! D:";
  
  //     this.optionButtons.forEach(btn => btn.style.display = "none");
  //     this.lockInButton.style.display = "none";
  
  //     clearInterval(this.round.countdown);
  //   }
    
  //   //FUNC time up lose screen
  //   showTimeUpLoseScreen() {
  //     document.getElementById("scenario-name").textContent = "TOO SLOW!!";
  //     document.getElementById("scenario").textContent = "YOU TOOK TOO LONG AND THE WIZARD CAUGHT UP! ( x _ x )";
  
  //     this.optionButtons.forEach(btn => btn.style.display = "none");
  //     this.lockInButton.style.display = "none";
  //   }
  
  //   //FUNC trigger state change
  //   stateChange(state) {
  //     this.state = STATES[state];
  //   }
  
    //FUNC assign imposter
    //chose random int between 1-3/1-4 (depending on number of players)
    //assign imposter role (impostor redirect)
}