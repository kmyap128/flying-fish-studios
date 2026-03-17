export class Scenario {
  constructor(scenarioName, scenarioData) {
    this.name = scenarioName;
    this.text = scenarioData.scenario;
    this.options = Object.values(scenarioData.options);
    this.type = SCENARIO_TYPES[scenarioData.type];
    this.media = {
      background: scenarioData.background,
      sound: scenarioData.sound,
      images: scenarioData.images,
      animation: scenarioData.animation,
    };
  }
}
