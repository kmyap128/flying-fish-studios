// Creature
const CREATURES = {
  CREATURE1: "creature 1",
  CREATURE2: "creature 2",
  CREATURE3: "creature 3",
  CREATURE4: "creature 4",
};

const ITEMS = {
  NONE: "",
};

// Scenario
const SCENARIO_TYPES = {
  ITEM: "item",
  OBSTACLE: "obstacle",
  COMBAT: "combat",
  BONUS: "bonus",
  MORAL: "moral",
  SACRIFICE: "sacrifice",
};

const STATES = {
  START: "start",
  ONBOARDING: "onboarding",
  ONGOING: "ongoing",
  SCENARIO: "scenario",
  SELECTION: "selection",
  RESULT: "result",
  END: "end",
  IDLE: "idle",
};

window.CREATURES = CREATURES;
window.ITEMS = ITEMS;
window.SCENARIO_TYPES = SCENARIO_TYPES;
window.STATES = STATES;
