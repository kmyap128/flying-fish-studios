import { Round } from "./round.js";
import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "./enums/enums.js";
import { Scenario } from "./scenario.js";
import { CreaturePlayer } from "./creaturePlayer.js";

export class Game {
  constructor() {
    //CONSTRUCTOR
    //players
    this.state = STATES.START;
    this.stage = 0;
    this.currentCategoryIndex = 0;
    this.wizardsGrasp = 0;

    this.allScenarios = null;
    this.scenarioFlow = [];
    this.categories = [];

    this.currentScenario = null;
    this.currentScenarioCategory = null;
    this.currentOptions = null;
    this.currentOptionsOrder = [];
    this.currentType = null;

    this.round = null;
    this.timerInterval = null;

    this.resultText = "";

    this.players = [
      new CreaturePlayer(null, null, null, null, null, 0),
      new CreaturePlayer(null, null, null, null, null, 1),
      new CreaturePlayer(null, null, null, null, null, 2),
      new CreaturePlayer(null, null, null, null, null, 3),
    ];

    // Callbacks (Server sends these to react)
    this.onScenarioChange = null;
    this.onGameEnd = null;
    this.onModeChange = null;
    this.onTimerTick = null;
    this.onPlayerChoice = null;
    this.onRoundResult = null;
  }

  assignCharacterToPedestal(pedestalIndex, species) {
    const allCharacters = {
      "Nine-Tailed Fish": {
        name: "Finley",
        image: "Finley_UI.png",
        description: "",
        item: "",
      },
      Jackalope: {
        name: "Sprig",
        image: "Sprig_UI.png",
        description: "",
        item: "",
      },
      "Duck Duck Goose": {
        name: "Waddles",
        image: "Waddles_UI.png",
        description: "",
        item: "",
      },
      Dinogon: {
        name: "Smoulder",
        image: "Smoulder_UI.png",
        description: "",
        item: "",
      },
    };

    const character = allCharacters[species];
    if (!character) {
      console.warn(`Unknown species: ${species}`);
      return;
    }

    const player = this.players[pedestalIndex];
    player.name = character.name;
    player.species = species;
    player.image = character.image;
    player.description = character.description;
    player.item = ITEMS[character.item] || null;

    console.log(
      `Pedestal ${pedestalIndex + 1} -> ${species} (${character.name})`,
    );
  }

  loadScenarios(data) {
    this.allScenarios = data;
    this.categories = Object.keys(this.allScenarios);
    this.scenarioFlow = [
      Object.entries(data.obstacle || {}),
      Object.entries(data.combat || {}),
      Object.entries(data.item || {}),
      Object.entries(data.sacrifice || {}),
      Object.entries(data.bonus || {}),
      Object.entries(data.dilemma || {}),
    ];
  }

  handleSacrificeScenario(newChoice) {
    let choice = newChoice;
    let response = this.currentOptions[choice];
    if (this.currentScenario.name == "The Statue of the Greedy King") {
      this.players.forEach((player) => {
        if (choice == "option 1") player.disabled = 1;
        else if (choice == "option 2") player.disabled = 2;
        else player.disabled = 3;
      });
      return [response[1], response[2]];
    } else {
      if (choice == "option 1") {
        this.players.forEach((player) => {
          player.item == null;
        });
        return [response[1], response[2]];
      } else if (choice == "option 2") {
        let chance = Math.random();
        let normalPlayers = [];
        let impostor;
        let out;
        this.players.forEach((player) => {
          if (player.isImpostor()) {
            impostor = player;
          } else {
            normalPlayers.push(player);
          }
        });
        if (chance < 0.15) {
          normalPlayers[0].out;
          out = normalPlayers[0];
        } else if (chance < 0.3) {
          normalPlayers[1].out;
          out = normalPlayers[1];
        } else if (chance < 0.45) {
          normalPlayers[2].out;
          out = normalPlayers[2];
        } else {
          impostor.out;
          out = impostor;
        }
        return [response[1], `${out.name} has been left behind`];
      } else {
        return [response[1], response[2]];
      }
    }
  }

  handleDilemmaScenario(newChoice) {
    let choice = newChoice;
    let result;
    if (newChoice == null) {
      choice = player.choice ?? "selfish";
    }

    if (choice == "selfish") {
      let chance = Math.random();
      if (chance < 0.3) {
        result = this.currentOptions[choice][1];
      } else {
        result = this.currentOptions[choice][2];
      }
    } else {
      result = [this.currentOptions[choice][1], this.currentOptions[choice][2]];
    }
    return result;
  }

  shuffleOptionKeys(options) {
    const keys = Object.keys(options);
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
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

    this.currentScenarioCategory = this.categories[this.currentCategoryIndex];

    const randomIndex = Math.floor(Math.random() * currentCategory.length);
    const [scenarioName, scenarioData] = currentCategory[randomIndex];

    this.currentScenario = new Scenario(
      scenarioName,
      scenarioData,
      this.currentScenarioCategory,
    );
    this.currentType = this.currentScenario.type;
    this.currentOptions = this.currentScenario.options;
    this.currentOptionsOrder = this.shuffleOptionKeys(this.currentOptions);
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

  registerChoice(pedestalIndex, optionKey) {
    const player = this.players[pedestalIndex];
    if (!player) return;

    player.setChoice(optionKey);

    if (this.onPlayerChoice) {
      this.onPlayerChoice({
        pedestalIndex,
        species: player.species,
        optionKey,
        choices: this.players.map((p) => ({
          species: p.species,
          pedestalIndex: p.pedestalIndex,
          choice: p.choice,
        })),
      });
    }
  }

  getMajorityChoice() {
    let tally;
    let impostorChoice;
    if (this.currentScenarioCategory == "dilemma") {
      tally = { helpful: 0, selfish: 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice = p.choice ?? "selfish";
          console.log("choice: ", choice);
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    } else if (this.currentScenarioCategory == "sacrifice") {
      tally = { "option 1": 0, "option 2": 0, "option 3": 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice = p.choice ?? "option 1";
          console.log("choice: ", choice);
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    } else {
      tally = { best: 0, neutral: 0, worst: 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice = p.choice ?? "worst";
          console.log("choice: ", choice);
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    }

    let winning;
    let maxVotes = 0;
    for (const [key, votes] of Object.entries(tally)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winning = this.currentOptions[key];
      } else if (votes === maxVotes) {
        winning = impostorChoice;
      }
    }

    //console.log("winning option: ", winning);

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

    let winningChoice;
    if (this.currentType == "synergy") {
      winningChoice = this.getMajorityChoice();
      let value = [];
      if (typeof value === "number") {
        if (this.currentScenarioCategory == "sacrifice") {
          value = this.handleSacrificeScenario(winningChoice);
          this.resultText = value[1];
          this.wizardsGrasp += value[0];
        } else if (this.currentScenarioCategory == "dilemma") {
          value = this.handleDilemmaScenario(winningChoice);
          this.resultText = value[1];
          this.wizardsGrasp += value[0];
        } else {
          this.resultText = value[2];
          this.wizardsGrasp += value[1];
        }
      }
      console.log(value);
    } else {
      let total = 0;
      this.players.forEach((p) => {
        if (!p.out) {
          const choiceIndex = p.choice ?? "option 1";
          //console.log("choice index: ", choiceIndex);
          let value = this.currentOptions[choiceIndex];
          if (this.currentScenarioCategory == "item") {
            p.item == this.currentScenario.item;
            this.resultText = value[2];
            total += value[1];
          } else if (this.currentScenarioCategory == "sacrifice") {
            value = this.handleSacrificeScenario(p.choice);
            this.resultText = value[1];
            total += value[0];
          } else {
            this.resultText = value[2];
            total += value[1];
          }
          console.log(value);
        }
      });
      console.log(winningChoice);
      console.log(this.currentOptions);
      console.log(this.currentOptions[winningChoice]);
      this.wizardsGrasp += total / this.players.length;
    }

    console.log(this.resultText);

    if (this.onRoundResult) {
      this.onRoundResult({
        winningChoice,
        wizardsGrasp: this.wizardsGrasp,
        playerChoices: this.players.map((p) => ({
          species: p.species,
          pedestalIndex: p.pedestalIndex,
          choice: p.choice,
          option: p.choice ? this.currentOptions[p.choice] : null,
        })),
      });
    }

    // Lose Condition
    if (this.wizardsGrasp >= 15) {
      this.endGame("lose");
      return;
    }

    setTimeout(() => {
      this.stage++;
      this.currentCategoryIndex++;
      this.loadCurrentScenario();
    }, 5000);
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
