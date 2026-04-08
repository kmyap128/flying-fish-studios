import { CREATURES, ITEMS, SCENARIO_TYPES, STATES } from "./enums/enums.js";

export class Scenario {
  constructor(scenarioName, scenarioData, scenarioCategory) {
    this.name = scenarioName;
    this.category = scenarioCategory;
    this.text = scenarioData.scenario;
    this.options = scenarioData.options;
    this.type = scenarioData.type;
    this.media = {
      background: scenarioData.background,
      sound: scenarioData.sound,
      images: scenarioData.images,
      animation: scenarioData.animation,
    };
  }
}
