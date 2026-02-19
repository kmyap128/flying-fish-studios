import { WizardBar } from "./wizardBar";
import { CreatureBar } from "./creatureBar";
import { Timer } from "./timer";
import './header.css'

export function Header({image}) {
    return (
        <div className="header-wrapper">
            <div id="creature-bar-container">
                <CreatureBar image={image} />
            </div>
            <div id ="wizard-bar-container">
                <WizardBar />
            </div>
            <div id="timer-container">
                <Timer />
            </div>
        </div>
    )
}