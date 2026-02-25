import { WizardBar } from "../wizard-bar/wizardBar";
import { CreatureBar } from "../creature-bar/creatureBar";
import { Timer } from "../timer/timer";
import './header.css'

export function Header({image, creatureName, timerStart, scenarioNumber}) {
    return (
        <div className="header-wrapper">
            <div id="creature-bar-container">
                <CreatureBar image={image}  creatureName={creatureName} />
            </div>
            <div id ="wizard-bar-container">
                <WizardBar />
            </div>
            <div id="timer-container">
                <Timer timerStart={timerStart} scenarioNumber={scenarioNumber} />
            </div>
        </div>
    )
}