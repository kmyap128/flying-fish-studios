let game = new Game();

const [scenarioData, setScenarioData] = null;
const [gameResult, setGameResult] = null;

const [mode, setMode] = "scenario";
const [countdown, setCountdown] = 5;

const setTransitions = () => {
  game.onScenarioChange = (data) => {
    setScenarioData(data);
  };

  game.onGameEnd = (result) => {
    setGameResult(result);
  };

  game.loadScenarios().then(() => {
    game.loadCurrentScenario();
  });
};

const setIntervalState = () => {
  if (!scenarioData) return;
  setMode("scenario");
  setCountdown(5);

  const interval = setinterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setMode("options");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
};

const handleSelectOption = (index) => {
  console.log("Selected index:", index);
  game.selectOption(index);
};

const handleLockIn = () => {
  console.log("Locking in option", game.selectedOptionIndex);
  game.endRound();
  console.log("Current Grasp:", game.wizardsGrasp);
};

export { setTransitions, setIntervalState, handleSelectOption, handleLockIn };
