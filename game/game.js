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
        image: "finley.png",
        description: "",
        item: "",
      },
      Jackalope: {
        name: "Sprig",
        image: "sprig.png",
        description: "",
        item: "",
      },
      "Duck Duck Goose": {
        name: "Waddles",
        image: "waddles.png",
        description: "",
        item: "",
      },
      Dinogon: {
        name: "Smoulder",
        image: "smoulder.png",
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
    this.categories.splice(2, 1);
    this.scenarioFlow = [
      Object.entries(data.obstacle || {}),
      Object.entries(data.combat || {}),
      /*Object.entries(data.item || {}), */
      Object.entries(data.sacrifice || {}),
      Object.entries(data.bonus || {}),
      Object.entries(data.dilemma || {}),
    ];
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
        const choice = p.choice ?? "selfish";
        console.log("choice: ", choice);
        tally[choice] += 1;
        if (p.isImpostor) impostorChoice = p.choice;
      });
    } else if (this.currentScenarioCategory == "sacrifice") {
      tally = { "option 1": 0, "option 2": 0, "option 3": 0 };
      this.players.forEach((p) => {
        const choice = p.choice ?? "option 1";
        console.log("choice: ", choice);
        tally[choice] += 1;
        if (p.isImpostor) impostorChoice = p.choice;
      });
    } else {
      tally = { best: 0, neutral: 0, worst: 0 };
      this.players.forEach((p) => {
        const choice = p.choice ?? "worst";
        console.log("choice: ", choice);
        tally[choice] += 1;
        if (p.isImpostor) impostorChoice = p.choice;
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
      if (this.currentScenarioCategory == "sacrifice") {
        handleSacrificeScenario();
      }
      if (typeof value === "number") {
        this.wizardsGrasp += value;
      }
    } else {
      let total = 0;
      this.players.forEach((player) => {
        const choiceIndex = player.choice ?? "option 1";
        console.log("choice index: ", choiceIndex);
        const value = this.currentOptions[choiceIndex][1];
        if (typeof value === "number") {
          total += value;
        }
        if (this.currentScenarioCategory == "item") {
          player.item == this.currentScenario.item;
        } else if (this.currentScenarioCategory == "sacrifice") {
          if (choiceIndex == "option 1") {
            player.disabled = 1;
          } else if (choiceIndex == "option 2") {
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

  handleSacrificeScenario(name, choice) {
    if (name == "The Statue of the Greedy King") {
      if (choice == "option 1") {
        
      }
    } else if (name == "The Glowing Bridge") {
    } else if (name == "The Illuminated Portal") {
    }
  }
}
