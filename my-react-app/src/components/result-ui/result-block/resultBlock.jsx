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
}) {

  const finleyUsedPassive = passive?.Finley == "Finley_Used";
  const smoulderUsedPassive = passive?.Smoulder == "Smoulder_Used"
  const waddlesUsedPassive = passive?.Waddles == "Waddles_Used"
  const sprigUsedPassive = passive?.Sprig == "Sprig_Used"

  const percent = (wizardsGrasp / 11) * 100;
  const rounded = Math.round(percent / 10) * 10;
  const clamped = Math.max(0, Math.min(100, rounded));

  const meterSrc = `/UI_Assets/TotalWG_Meters/WG_Meter_${clamped}.png`

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
            isInjured={false}
          />
          <CharacterBlock
            characterName="Smoulder"
            passiveUsed={smoulderUsedPassive}
            isInjured={false}
          />
          <CharacterBlock
            characterName="Sprig"
            passiveUsed={sprigUsedPassive}
            isInjured={false}
          />
          <CharacterBlock
            characterName="Waddles"
            passiveUsed={waddlesUsedPassive}
            isInjured={false}
          />
        </div>
        <div className="grasp-breakdown">
          <div className="scorecard">
            <img src="/UI_Assets/Scorecard/Scorecard_BKG.png" alt="scorecard" />
          </div>
          <div className="grasp-meter">
            <img
              src={meterSrc}
              alt="grasp meter"
            />
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
