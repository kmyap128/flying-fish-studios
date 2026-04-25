import "./resultBlock.css";
import { useEffect, useRef } from "react";
import { TimerMeter } from "../../hud-ui/timer-meter/timerMeter.jsx";
import { CharacterBlock } from "../character-block/characterBlock.jsx";

export function ResultBlock({
  scenarioNum,
  chosenOption,
  resultText,
  passive,
  countdown,
  timerDuration,
  wizardsGrasp,
  scenarioType,
  isInjured,
}) {

  const finleyUsedPassive = passive?.Finley == "Finley_Used";
  const smoulderUsedPassive = passive?.Smoulder == "Smoulder_Used"
  const waddlesUsedPassive = passive?.Waddles == "Waddles_Used"
  const sprigUsedPassive = passive?.Sprig == "Sprig_Used"

  const percent = (wizardsGrasp / 15) * 100;
  const rounded = Math.round(percent / 10) * 10;
  const clamped = Math.max(0, Math.min(100, rounded));
  const displayPercent = Math.max(0, Math.min(100, Math.round(percent)));

  const meterSrc = `/UI_Assets/TotalWG_Meters/WG_Meter_${clamped}.png`

  console.log("scenarioType in ResultBlock:", scenarioType);

  return (
    <div className="result-content">
      <div className="top-section">
        <p className="scenario-label">"{chosenOption}"</p>
        <p className="result-text">{resultText}</p>
      </div>

      <div className="mid-section">
        <div className="character-panel">
          <CharacterBlock
            characterName="Finley"
            passiveUsed={finleyUsedPassive}
            isInjured={isInjured}
          />
          <CharacterBlock
            characterName="Smoulder"
            passiveUsed={smoulderUsedPassive}
            isInjured={isInjured}
          />
          <CharacterBlock
            characterName="Sprig"
            passiveUsed={sprigUsedPassive}
            isInjured={isInjured}
          />
          <CharacterBlock
            characterName="Waddles"
            passiveUsed={waddlesUsedPassive}
            isInjured={isInjured}
          />
        </div>
        <div className="grasp-breakdown">
          <div className="scorecard">
            <img className="scorecard-bkg" src="/UI_Assets/Scorecard/Scorecard_BKG.png" alt="scorecard" />
            <img className="scenario-icon" src={`/UI_Assets/Scorecard/icons_${scenarioType}.png`} alt="scenario type" />
            <p className="synergy-text">{scenarioType}</p>
          </div>
          <div className="grasp-meter">
            <img src={meterSrc} alt="grasp meter" className="meter-img" />
            <span className="grasp-percent">{displayPercent}%</span>
          </div>
        </div>
      </div>

      <div className="time-meter">
        <TimerMeter timerCurrent={countdown} timerDuration={timerDuration} />
        <span>next question</span>
      </div>
    </div>
  );
}
