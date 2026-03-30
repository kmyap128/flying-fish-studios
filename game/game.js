import { Round } from "./round.js";
import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "./enums/enums.js";
import { Scenario } from "./scenario.js";
import { CreaturePlayer } from "./creaturePlayer.js";

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

    // Callbacks (Server sends these to react)
    this.onScenarioChange = null;
    this.onGameEnd = null;
    this.onModeChange = null;
    this.onTimerTick = null;
    this.timerInterval = null;
  }

  generateCreatures(data) {
    data.forEach((character) => {
      this.players.push(
        new CreaturePlayer(
          character.name,
          character.key,
          character.image,
          character.description,
          character.item,
        ),
      );
    });

    this.players.forEach((player) => {
      let pedestals = [1, 2, 3, 4];
      let randomInt = (Math.random() * this.players.length()).floor();
      player.pedestal = pedestals.pop(randomInt);
    });
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
    this.currentOptions = this.currentScenario.options;
    this.state = STATES.SCENARIO;

    if (this.onScenarioChange) {
      this.round = new Round(this.currentScenario);
      this.onScenarioChange(this.round);
    }

    this.startTimer(5, "scenario", () => {
      if (this.onModeChange) this.onModeChange("options");
      this.startTimer(10, "options", () => {
        this.endRound();
      });
    });
  }

  startTimer(duration, mode, onComplete) {
    clearInterval(this.timerInterval);
    let remaining = duration;

    if (this.onTimerTick) this.onTimerTick({ mode, remaining });

    this.timerInterval = setInterval(() => {
      remaining--;
      if (this.onTimerTick) this.onTimerTick({ mode, remaining });
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        onComplete();
      }
    }, 1000);
  }

  selectOption(index) {
    this.selectedOptionIndex = index;
  }

  //FUNC end round?
  endRound() {
    if (this.currentType !== "item") {
      let value;
      if (this.currentOptions[this.selectedOptionIndex][1]) {
        value = this.currentOptions[this.selectedOptionIndex][1];
      } else {
        value = this.currentOptions[0][1];
      }

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
}
