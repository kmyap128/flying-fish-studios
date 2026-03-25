import { Round } from "./round.js";
import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "./enums/enums.js";
import { Scenario } from "./scenario.js";

export class Game {
  constructor() {
    //CONSTRUCTOR
    //players
    this.players = [];
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

    this.round = null;

    // Callbacks (React will assign these)
    this.onScenarioChange = null;
    this.onGameEnd = null;
  }

  loadScenarios(data) {
    this.allScenarios = data;

    this.scenarioFlow = [
      Object.entries(data.obstacle || {}),
      Object.entries(data.combat || {}),
      Object.entries(data.item || {}),
      Object.entries(data.sacrifice || {}),
      Object.entries(data.bonus || {}),
      Object.entries(data.dilemma || {}),
    ];
  }

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

    this.currentScenario = new Scenario(scenarioName, scenarioData);

    this.state = STATES.SCENARIO;

    if (this.onScenarioChange) {
      this.round = new Round(this.currentScenario);
      this.onScenarioChange(this.round);
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

  assignPlayers() {}

  //FUNC assign imposter
  //chose random int between 1-3/1-4 (depending on number of players)
  //assign imposter role (impostor redirect)
  assignImpostor() {
    let randomInt = (Math.random() * this.players.length()).floor();

    this.players[randomInt].makeImpostor();
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
}
