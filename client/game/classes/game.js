//import players (2-3 instances)
//import imposter (1 instance)
//import round
import { Round } from "./round.js";

import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "../enums/enums.js";

import { CreaturePlayer } from "./creaturePlayer.js";
import { ImpostorPlayer } from "./impostorPlayer.js";

export class Game {
  constructor(players, impostor, scenarioFlow, optionButtons, lockInButton, timerElement, circle) {
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
    //scenarioFlow
    this.scenarioFlow = scenarioFlow;
    this.currentCategoryIndex = 0;

    this.optionButtons = optionButtons;
    this.lockInButton = lockInButton;
    this.timerElement = timerElement
    this.circle = circle;

    this.selectedOption = null;
    this.selectedOptionIndex = null;
    this.wizardsGrasp = 0;

  }

  update() {
    //update round timer
    if (this.round != null) {
      this.round.update();
    }
    //update check trigger state change
  }

  //FUNC async load all scenarios
  async loadScenarios() {

    const res = await fetch("/data/scenarios.json");
    const data = await res.json();

    this.allScenarios = data;

    this.obstacleScenarios = Object.entries(data.obstacle || {});
    this.combatScenarios = Object.entries(data.combat || {});
    this.itemScenarios = Object.entries(data.item || {});
    this.sacrificeScenarios = Object.entries(data.sacrifice || {});
    this.bonusScenarios = Object.entries(data.bonus || {});
    this.dilemmaScenarios = Object.entries(data.dilemma || {});

    this.scenarioFlow = [
      () => this.obstacleScenarios,
      () => this.combatScenarios,
      () => this.itemScenarios,
      () => this.sacrificeScenarios,
      () => this.bonusScenarios,
      () => this.dilemmaScenarios
    ];
  }



  //FUNC start round
  startRound(scenario, options, type, media) {
    this.round = new Round(scenario, options, type, media);
    this.state = STATES.SCENARIO;
    this.currentOptions = options;
    this.currentType = type;

    document.getElementById("scenario-name").textContent = scenario.name;
    document.getElementById("scenario").textContent = scenario.text;

    this.optionButtons.forEach((button, index) => {
      if (index < options.length) {
        button.style.display = "inline-block";
        button.textContent = options[index][0];
        button.disabled = false;
        button.classList.remove("selected");
      } else {
        button.style.display = "none";
      }
    });

    this.selectedOption = null;
    this.lockInButton.disabled = true;

    this.round.startTimer(
      this.timerElement,
      this.circle,
      () => this.showTimeUpLoseScreen()
    );
  }

  //FUNC load current scenario
  loadCurrentScenario() {

    if (this.currentCategoryIndex >= this.scenarioFlow.length) {
      this.showWinScreen();
      return;
    }

    const currentCategory = this.scenarioFlow[this.currentCategoryIndex]();

    if (!currentCategory || currentCategory.length === 0) {
      this.currentCategoryIndex++;
      this.loadCurrentScenario();
      return;
    }

    const randomIndex = Math.floor(Math.random() * currentCategory.length);
    const [scenarioName, scenarioData] = currentCategory[randomIndex];

    const options = Object.values(scenarioData.options);

    this.startRound(
      {
        name: scenarioName,
        text: scenarioData.scenario
      },
      options,
      scenarioData.type,
      {
        sound: scenarioData.sound,
        background: scenarioData.background,
        images: scenarioData.images,
        animation: scenarioData.animation
      }
    );
  }

  //FUNC end round?
  endRound() {
    if (this.currentType !== "item") {

      const value = this.currentOptions[this.selectedOptionIndex][1];

      if (typeof value === "number") {
        this.wizardsGrasp += value;
        console.log("Wizard's Grasp Value:", value);
      }
      console.log("Total Wizard's Grasp:", this.wizardsGrasp);

    }

    // Lose Condition
    if (this.wizardsGrasp >= 3) {
      this.showLoseScreen();
      return;
    }

    this.stage++;
    this.currentCategoryIndex++;
    this.loadCurrentScenario();
  }

  //FUNC win screen
  showWinScreen() {
    document.getElementById("scenario-name").textContent = "FREEDOM!!!";
    document.getElementById("scenario").textContent = "YOU SUCCESSFULLY MADE IT BACK HOME!! :DDDDDDD";

    this.optionButtons.forEach(btn => btn.style.display = "none");
    this.lockInButton.style.display = "none";

    clearInterval(this.round.countdown);
  }

  //FUNC lose screen
  showLoseScreen() {
    document.getElementById("scenario-name").textContent = "YOU LOSE!!!";
    document.getElementById("scenario").textContent = "YOU GOT CAPTURED BY THE WIZARD! D:";

    this.optionButtons.forEach(btn => btn.style.display = "none");
    this.lockInButton.style.display = "none";

    clearInterval(this.round.countdown);
  }
  
  //FUNC time up lose screen
  showTimeUpLoseScreen() {
    document.getElementById("scenario-name").textContent = "TOO SLOW!!";
    document.getElementById("scenario").textContent = "YOU TOOK TOO LONG AND THE WIZARD CAUGHT UP! ( x _ x )";

    this.optionButtons.forEach(btn => btn.style.display = "none");
    this.lockInButton.style.display = "none";
  }

  //FUNC trigger state change
  stateChange(state) {
    this.state = STATES[state];
  }

  //FUNC assign imposter
  //chose random int between 1-3/1-4 (depending on number of players)
  //assign imposter role (impostor redirect)
}
