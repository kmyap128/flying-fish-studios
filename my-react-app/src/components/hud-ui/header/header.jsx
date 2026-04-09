import { WizardBar } from "../wizard-bar/wizardBar";
import { CreatureBar } from "../creature-bar/creatureBar";
import { Timer } from "../timer/timer";
import './header.css'

export function Header({ image, creatureName, wizardsGrasp, timerCurrent, timerDuration, scenarioNumber }) {
  return (
    <div className="header-wrapper">
      <div id="creature-bar-container">
        <CreatureBar image={image} creatureName={creatureName} />
      </div>
      <div id="wizard-bar-container">
        <WizardBar wizardsGrasp={wizardsGrasp} />
      </div>
      <div id="timer-container">
        <Timer timerCurrent={timerCurrent} timerDuration={timerDuration} scenarioNumber={scenarioNumber} />
      </div>
    </div>
  );
}