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
    this.injury = false;
    // If injury is true, add an extra 1? WG until the injury is cleared

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

  //ITEMS LOGIC!!!!!!!!
  // possible item effects: heal injury, add 5s to timer, remove 25% WG,
  // prevent an injury, Mystery box ( can be used for WG gain/reduce )
  // if all 4 players choose the same answer, remove all wizard's grasp

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

      // Handle injury trigger
      if (value === 2) {
        this.injury = true;
        console.log(`Injury : ${this.injury}`);
      }
    }

    // Apply injury
    if (this.injury) {
      this.wizardsGrasp += 1;
      console.log(this.injury);
    }

    // Lose Condition
    if (this.wizardsGrasp >= 15) {
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

}