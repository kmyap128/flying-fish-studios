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
    this.categories = [];

    this.currentScenario = null;
    this.currentScenarioCategory = null;
    this.currentOptions = null;
    this.currentType = null;

    this.round = null;
    this.timerInterval = null;

    // Callbacks (Server sends these to react)
    this.onScenarioChange = null;
    this.onGameEnd = null;
    this.onModeChange = null;
    this.onTimerTick = null;
    this.onPlayerChoice;
  }

  generateCreatures(data) {
    const entries = Object.entries(data);

    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    this.players = entries.map(([species, character], index) => {
      return new CreaturePlayer(
        character.name,
        species,
        character.image,
        character.description,
        character.item,
        index,
      );
    });

    // this.players.forEach((player) => {
    //   let pedestals = [1, 2, 3, 4];
    //   let randomInt = Math.floor(Math.random() * this.players.length);
    //   player.pedestal = pedestals.splice(randomInt, 1)[0];
    // });

    console.log(
      "🐾 Players assigned:",
      this.players.map((p) => `${p.species} → pedestal ${p.pedestalIndex + 1}`),
    );
  }

  loadScenarios(data) {
    this.allScenarios = data;

    this.categories = Object.keys(this.allScenarios);
    this.scenarioFlow = [
      Object.entries(data.obstacle || {}),
      Object.entries(data.combat || {}),
      /*Object.entries(data.item || {}), */
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

    this.currentScenarioCategory =
      SCENARIO_TYPES[this.categories[this.currentCategoryIndex]];
    console.log("Scenario Category: ", this.currentScenarioCategory);

    const randomIndex = Math.floor(Math.random() * currentCategory.length);
    const [scenarioName, scenarioData] = currentCategory[randomIndex];

    this.currentScenario = new Scenario(
      scenarioName,
      scenarioData,
      this.currentScenarioCategory,
    );
    this.currentType = this.currentScenario.type;
    this.currentOptions = this.currentScenario.options;
    this.state = STATES.SCENARIO;

    this.players.forEach((p) => p.resetChoice());

    if (this.onModeChange) this.onModeChange("scenario");

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

  registerChoice(pedestalIndex, optionIndex) {
    const player = this.players.find((p) => p.pedestalIndex === pedestalIndex);
    if (!player) return;

    player.setChoice(optionIndex);

    if (this.onPlayerChoice) {
      this.onPlayerChoice({
        pedestalIndex,
        species: player.species,
        optionIndex,
        choices: this.players.map((p) => ({
          species: p.species,
          pedestalIndex: p.pedestalIndex,
          choice: p.choice,
        })),
      });
    }
  }

  getMajorityChoice() {
    const tally = { best: 0, neutral: 0, worst: 0 };
    this.players.forEach((p) => {
      const choice = p.choice ?? "worst";
      console.log("choice: ", choice);
      tally[choice] += 1;
    });

    let maxVotes = 0;
    let winning = "";

    for (const [key, votes] of Object.entries(tally)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winning = this.currentOptions[key];
      }
    }
    console.log("winning option: ", winning);

    return winning;
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
    clearInterval(this.timerInterval);

    if (this.currentType == "synergy") {
      const winningChoice = this.getMajorityChoice();
      const value = winningChoice[1];
      if (this.currentScenarioCategory == SCENARIO_TYPES.SACRIFICE) {
      }
      if (typeof value === "number") {
        this.wizardsGrasp += value;
      }
    } else {
      let total = 0;
      this.players.forEach((player) => {
        const choiceIndex = player.choice ?? "option 1";
        //console.log(this.currentOptions);
        //console.log(this.currentOptions[choiceIndex]);
        console.log("choice index: ", choiceIndex);
        const value = this.currentOptions[choiceIndex][1];
        if (typeof value === "number") {
          total += value;
        }
        if (this.currentScenarioCategory == SCENARIO_TYPES.ITEM) {
          player.item == this.currentScenario.item;
        } else if (this.currentScenarioCategory == SCENARIO_TYPES.SACRIFICE) {
          if ((choiceIndex = "option 1")) {
            player.disabled = 1;
          } else if ((choiceIndex = "option 2")) {
            player.disabled = 2;
          } else {
            player.disabled = 3;
          }
        }
      });
      this.wizardsGrasp += total / this.players.length;
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
    clearInterval(this.timerInterval);
    this.state = STATES.END;

    if (this.onGameEnd) {
      this.onGameEnd(result); // "win" or "lose"
    }
  }

  //FUNC assign imposter
  //chose random int between 1-3/1-4 (depending on number of players)
  //assign imposter role (impostor redirect)
  assignImpostor() {
    let randomInt = Math.floor(Math.random() * this.players.length);

    this.players[randomInt].makeImpostor();

    console.log(this.players[randomInt], " is impostor");
  }
}
