import { Round } from "./round.js";
import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "./enums/enums.js";
import { Scenario } from "./scenario.js";
import { CreaturePlayer } from "./creaturePlayer.js";
import mp3Duration from "mp3-duration";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    this.currentMode = null;

    this.round = null;
    this.timerInterval = null;

    this.chosen = [false, false, false, false];
    this.resultText = "";

    this.players = [
      new CreaturePlayer(0),
      new CreaturePlayer(1),
      new CreaturePlayer(2),
      new CreaturePlayer(3),
    ];

    // Callbacks (Server sends these to react)
    this.onScenarioChange = null;
    this.onGameEndPlayer = null;
    this.onGameEndImpostor = null;
    this.onModeChange = null;
    this.onTimerTick = null;
    this.onPlayerChoice = null;
    this.onRoundResult = null;
  }

  assignCharacterToPedestal(pedestalIndex, species) {
    const allCharacters = {
      "Nine-Tailed Fish": {
        name: "Finley",
        heroImage: "Fin_Hero.png",
        traitorImage: "Fin_Trait.png",
        portrait: "Finley_LargePortrait.png",
        nameBoard: "Finley_NameBoard.png",
        infoBlock: "Fin_Block.png",
      },
      Jackalope: {
        name: "Sprig",
        heroImage: "Spr_Hero.png",
        traitorImage: "Spr_Trait.png",
        portrait: "Sprig_LargePortrait.png",
        nameBoard: "Sprig_NameBoard.png",
        infoBlock: "Spr_Block.png",
      },
      "Duck Duck Goose": {
        name: "Waddles",
        heroImage: "Wad_Hero.png",
        traitorImage: "Wad_Trait.png",
        portrait: "Waddles_LargePortrait.png",
        nameBoard: "Waddles_NameBoard.png",
        infoBlock: "Wad_Block.png",
      },
      Dinogon: {
        name: "Smoulder",
        heroImage: "Smo_Hero.png",
        traitorImage: "Smo_Trait.png",
        portrait: "Smoulder_LargePortrait.png",
        nameBoard: "Smoulder_NameBoard.png",
        infoBlock: "Smo_Block.png",
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
    player.heroImage = character.heroImage;
    player.traitorImage = character.traitorImage;
    player.portrait = character.portrait;
    player.nameBoard = character.nameBoard;
    player.infoBlock = character.infoBlock;
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
      // Object.entries(data.item || {}),
      Object.entries(data.sacrifice || {}),
      Object.entries(data.bonus || {}),
      Object.entries(data.dilemma || {}),
    ];
  }

  handleSacrificeScenario(newChoice) {
    let choice = newChoice;
    let response = choice;
    console.log(choice);
    if (this.currentScenario.name == "The Statue of the Greedy King") {
      this.players.forEach((player) => {
        if (choice == "option 1") player.disabled = 1;
        else if (choice == "option 2") player.disabled = 2;
        else player.disabled = 3;
      });
      return [response[1], response[0]];
    } else {
      if (choice == "option 1") {
        this.players.forEach((player) => {
          player.item == false;
        });
        return [response[1], response[0]];
      } else if (choice == "option 2") {
        let chance = Math.random();
        let normalPlayers = [];
        let impostor;
        let out;
        this.players.forEach((player) => {
          if (player.isImpostor) {
            impostor = player;
          } else if (!player.out) {
            normalPlayers.push(player);
          }
        });
        if (chance < 0.15) {
          normalPlayers[0].out = true;
          out = normalPlayers[0];
        } else if (chance < 0.3) {
          normalPlayers[1].out = true;
          out = normalPlayers[1];
        } else if (chance < 0.45) {
          normalPlayers[2].out = true;
          out = normalPlayers[2];
        } else {
          impostor.out = true;
          out = impostor;
        }
        return [response[1], `${out.name} has been left behind`];
      } else {
        if (this.currentScenario.name === "The Glowing Bridge") {
          return [response[1], response[2]];
        }
        return [response[1], response[0]];
      }
    }
  }

  handleDilemmaScenario(newChoice, newKey) {
    let choice = newChoice;
    console.log(choice);
    let result;
    console.log("DILEMMA CHOICE");
    console.log(choice);
    if (newKey == "selfish") {
      let chance = Math.random();
      if (chance < 0.3) {
        console.log("choice[1][0] ", choice[1][0]);
        console.log("choice[1][1] ", choice[1][1]);
        result = [choice[1][0], choice[1][1]];
      } else {
        console.log("choice[2][0] ", choice[2][0]);
        console.log("choice[2][1] ", choice[2][1]);
        result = [choice[2][0], choice[2][1]];
      }
    } else {
      result = [choice[1], choice[2]];
    }
    return result;
  }

  shuffleOptionKeys(options) {
    const keys = Object.keys(options);
    if (this.currentScenario.name !== "The Statue of the Greedy King") {
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
    }
    return keys;
  }

  //FUNC load current scenario
  loadCurrentScenario() {
    if (this.currentCategoryIndex >= this.scenarioFlow.length) {
      setTimeout(() => this.endGame(true), 5000);
      return;
    }

    if (this.onModeChange) {
      this.currentMode = "scenario";
      this.onModeChange("scenario");
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

    const narrationPath = path.join(
      __dirname,
      `../data/sounds/${this.currentScenario.media.sound}`,
    );
    let narrationDuration;

    mp3Duration(narrationPath, (err, duration) => {
      if (err) return console.log(err.message);
      narrationDuration = duration;

      this.startTimer(narrationDuration, "scenario", () => {
        this.currentMode = "options";
        if (this.onModeChange) this.onModeChange("options");
        this.startTimer(20, "options", () => {
          this.currentMode = null;
          this.endRound();
        });
      });
    });
  }

  registerChoice(pedestalIndex, optionKey) {
    if (this.currentMode !== "options") return;
    if (this.state !== STATES.SCENARIO) return;
    const player = this.players[pedestalIndex];
    if (!player) return;
    if (player.out) return;

    if (optionKey === player.disabled) return;
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
      if (player.choice !== player.disabled) {
        this.chosen[pedestalIndex] = true;
      }
    }
    console.log(player.species, player.choice);

    let choices = 0;
    this.chosen.forEach((choice) => {
      if (choice) {
        choices += 1;
      }
    });

    const playersIn = this.players.filter((p) => !p.out).length;

    if (choices >= playersIn) {
      this.endRound();
    }
  }

  getMajorityChoice() {
    let tally;
    let impostorChoice;
    if (this.currentScenarioCategory == "dilemma") {
      tally = { helpful: 0, selfish: 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice =
            p.choice && p.choice !== this.currentOptionsOrder[p.disabled]
              ? p.choice
              : p.disabled
                ? this.currentOptionsOrder[p.disabled] == "selfish"
                  ? "helpful"
                  : "selfish"
                : "selfish";
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    } else if (this.currentScenarioCategory == "sacrifice") {
      tally = { "option 1": 0, "option 2": 0, "option 3": 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice =
            p.choice && p.choice !== this.currentOptionsOrder[p.disabled]
              ? p.choice
              : p.disabled
                ? this.currentOptionsOrder[p.disabled] == "option 1"
                  ? "option 2"
                  : "option 1"
                : "option 1";
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    } else {
      tally = { best: 0, neutral: 0, worst: 0 };
      this.players.forEach((p) => {
        if (!p.out) {
          const choice =
            p.choice && p.choice !== this.currentOptionsOrder[p.disabled]
              ? p.choice
              : p.disabled
                ? this.currentOptionsOrder[p.disabled] == "worst"
                  ? "neutral"
                  : "worst"
                : "worst";
          tally[choice] += 1;
          if (p.isImpostor) impostorChoice = choice;
        }
      });
    }

    let winning;
    let winningKey;
    let maxVotes = 0;
    for (const [key, votes] of Object.entries(tally)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winning = this.currentOptions[key];
        winningKey = key;
      } else if (votes === maxVotes) {
        winning = this.currentOptions[impostorChoice];
        winningKey = key;
      }
    }

    return [winning, winningKey];
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

  // Define the 4 passives up here

  SmoulderPassive(roundWG) {
    const smoulder = this.players.find(
      (p) => p.species === "Dinogon" && !p.out && !p.isImpostor && !p.item,
    );
    if (!smoulder) return ["No_Smoulder", roundWG];

    let didReduce = false;
    let didInjure = false;

    //1st effect
    if (smoulder.injury) {
      console.log("pre-smoulder", roundWG);
      roundWG -= 1;
      didReduce = true;
      console.log(`Smoulder took some grasp away!`);
      console.log("post-smoulder", roundWG);
    }

    //2nd effect
    if (Math.random() < 0.5) {
      const teammates = this.players.filter((p) => p != smoulder && !p.out);

      if (teammates.length > 0) {
        const randomIndex = Math.floor(Math.random() * teammates.length);
        const injuredTeammate = teammates[randomIndex];
        injuredTeammate.injury = true;
        didInjure = true;
        console.log(`Smoulder injured ${injuredTeammate.name}`);
      }
    }

    // Decide return value
    if (didInjure && didReduce) return ["Smoulder_Both", roundWG]; //Both passives used
    if (didInjure) return ["Smoulder_Injured", roundWG]; // Injured a teammate
    if (didReduce) return ["Smoulder_WG_Reduced", roundWG]; //reduced the wizards grasp
    return ["Smoulder_None", roundWG];
  }

  FinleyPassive() {
    const finley = this.players.find(
      (p) =>
        p.species === "Nine-Tailed Fish" && !p.out && !p.isImpostor && !p.item,
    );
    if (!finley) return "No_Finley";

    // Get all injured players (that are stil in)
    const injuredPlayers = this.players.filter((p) => p.injury && !p.out);

    //Trigger if 2+ teammates are injured
    if (injuredPlayers.length >= 2) {
      const randomIndex = Math.floor(Math.random() * injuredPlayers.length);
      const healedPlayer = injuredPlayers[randomIndex];

      healedPlayer.injury = false;
      console.log(`Finley healed ${healedPlayer.name}`);

      return "Finley_Healed";
    }

    return "Finley_None";
  }

  WaddlesPassive(roundWG) {
    const waddles = this.players.find(
      (p) =>
        p.species === "Duck Duck Goose" && !p.out && !p.isImpostor && !p.item,
    );
    if (!waddles) return ["No_Waddles", roundWG];

    // Count choices
    const tally = {};

    this.players.forEach((p) => {
      if (!p.out && p.choice) {
        tally[p.choice] = (tally[p.choice] || 0) + 1;
      }
    });

    // Check for 3 choices
    const hasExactlyThree = Object.values(tally).some((count) => count === 3);

    if (hasExactlyThree) {
      console.log("pre-waddles", roundWG);
      roundWG -= 1; //changed from 2 to 1 for balance
      console.log("Waddles reduced the Wizard's Grasp!");
      console.log("post-waddles", roundWG);
      return ["Waddles_Reduced", roundWG];
    }

    return ["Waddles_None", roundWG];
  }

  SprigPassive(roundWG) {
    const sprig = this.players.find(
      (p) => p.species === "Jackalope" && !p.out && !p.isImpostor && !p.item,
    );
    if (!sprig) return ["No_Sprig", roundWG];

    // Count all choices
    const tally = {};

    this.players.forEach((p) => {
      if (!p.out && p.choice) {
        tally[p.choice] = (tally[p.choice] || 0) + 1;
      }
    });

    // Check if Sprig is the ONLY one who chose his option
    const count = tally[sprig.choice];

    if (count === 1) {
      console.log("pre-sprig", roundWG);
      roundWG *= 0.5;
      console.log("Sprig reduced WG by 50%");
      console.log("post-sprig", roundWG);
      return ["Sprig_Halved", roundWG];
    }
    return ["Sprig_None", roundWG];
  }

  //FUNC end round?
  endRound() {
    clearInterval(this.timerInterval);
    let winningChoice;
    let winningChoices = [];
    let winningKey;
    let value;
    let roundWG = 0;
    if (this.currentType == "synergy") {
      winningChoice = this.getMajorityChoice()[0];
      winningKey = this.getMajorityChoice()[1];
      value = [winningChoice[1], winningChoice[2]];
      if (this.currentScenarioCategory == "combat") {
        this.players.forEach((p) => {
          if (p.choice == "worst") {
            p.injury = true;
            console.log(p.injury);
          }
        });
      }
      if (this.currentScenarioCategory == "sacrifice") {
        value = this.handleSacrificeScenario(winningChoice);
        console.log(value);
        this.resultText = value[1];
        console.log("sacrifice value", value[0]);
        roundWG = value[0];
      } else if (this.currentScenarioCategory == "dilemma") {
        value = this.handleDilemmaScenario(winningChoice, winningKey);
        this.resultText = value[1];
        console.log("dilemma value", value[0]);
        roundWG = value[0];
      } else {
        this.resultText = value[1];
        console.log("other values", value[0]);
        roundWG = value[0];
      }
    } else {
      let total = 0;
      let value = [];
      this.players.forEach((p) => {
        if (!p.out) {
          const choiceIndex =
            p.choice && p.choice !== this.currentOptionsOrder[p.disabled]
              ? p.choice
              : p.disabled
                ? this.currentOptionsOrder[p.disabled] == "option 1"
                  ? "option 2"
                  : "option 1"
                : "option 1";
          winningChoices.push(this.currentOptions[choiceIndex]);
          value = this.currentOptions[choiceIndex];
          // if (this.currentScenarioCategory == "item") {
          //   p.item == this.currentScenario.item;
          //   this.resultText = value[2];
          //   total += 1;
          // } else
          if (this.currentScenarioCategory == "sacrifice") {
            value = this.handleSacrificeScenario(
              this.currentOptions[choiceIndex],
            );
            this.resultText = value[1];
            total += value[0];
          } else {
            this.resultText = value[2];
            total += value[1];
          }
        }
      });
      const playersIn = this.players.filter((p) => !p.out).length;
      if (typeof total === "number" && playersIn > 0) {
        roundWG = total / playersIn;
      }
    }
    console.log("Result Text ");
    console.log(this.resultText);
    const smoulderAction = this.SmoulderPassive(roundWG);
    const smoulderResult = smoulderAction[0];
    roundWG = smoulderAction[1];
    const finleyResult = this.FinleyPassive();
    const sprigAction = this.SprigPassive(roundWG);
    const sprigResult = sprigAction[0];
    roundWG = sprigAction[1];
    const waddlesAction = this.WaddlesPassive(roundWG);
    const waddlesResult = waddlesAction[0];
    roundWG = waddlesAction[1];

    this.wizardsGrasp += roundWG;
    console.log("Wizards Grasp");
    console.log(this.wizardsGrasp);

    if (this.onRoundResult) {
      this.onRoundResult({
        winningChoice,
        resultText: this.resultText,
        wizardsGrasp: this.wizardsGrasp,

        passives: {
          Smoulder: smoulderResult,
          Finley: finleyResult,
          Sprig: sprigResult,
          Waddles: waddlesResult,
        },

        playerChoices: this.players.map((p) => ({
          species: p.species,
          pedestalIndex: p.pedestalIndex,
          choice: p.choice,
          injury: p.injury,
          option: p.choice ? this.currentOptions[p.choice] : null,
        })),
      });
    }
    if (this.onModeChange) this.onModeChange("result");

    this.chosen = [false, false, false, false];

    this.startTimer(15, "result", () => {
      if (this.wizardsGrasp >= 11) {
        this.endGame(false);
        return;
      }
      this.stage++;
      this.currentCategoryIndex++;
      this.loadCurrentScenario();
    });
  }

  endGame(result) {
    console.log("endGame called with result:", result);
    console.log("onGameEndPlayer exists:", !!this.onGameEndPlayer);
    console.log("onGameEndImpostor exists:", !!this.onGameEndImpostor);

    clearInterval(this.timerInterval);
    this.state = STATES.END;

    const playerResult = result === "win" ? "win" : "lose";
    const impostorResult = result === "win" ? "lose" : "win";

    if (this.onGameEndPlayer) this.onGameEndPlayer(playerResult);
    if (this.onGameEndImpostor) this.onGameEndImpostor(impostorResult);
  }

  //FUNC assign imposter
  //chose random int between 1-3/1-4 (depending on number of players)
  //assign imposter role (impostor redirect)
  assignImpostor() {
    let randomInt = Math.floor(Math.random() * this.players.length);

    this.players[randomInt].makeImpostor();

    console.log(this.players[randomInt].name, " is impostor");
  }
}
