import './resultBlock.css';
import { useEffect, useRef } from 'react';
import { TimerMeter } from '../../hud-ui/timer-meter/timerMeter.jsx';
import { CharacterBlock } from '../character-block/characterBlock.jsx';

export function ResultBlock({ scenarioNum, resultText, countdown, timerDuration }) {   
  return (
    <div className="result-content">

      <div className="top-section">
        <p className="scenario-label">Scenario {scenarioNum}</p>
        <p className="result-text">{resultText}</p>
      </div>

      <div className="mid-section">
        <div className="character-panel">
          <CharacterBlock characterName="Finley" itemUsed={false} isInjured={false} />
          <CharacterBlock characterName="Smoulder" itemUsed={false} isInjured={false} />
          <CharacterBlock characterName="Sprig" itemUsed={false} isInjured={false} />
          <CharacterBlock characterName="Waddles" itemUsed={false} isInjured={false} />
        </div>
        <div className="grasp-breakdown">

        </div>
      </div>

      <div className="time-meter">
        <TimerMeter
          timerCurrent={countdown}
          timerDuration={timerDuration}
        />
        <span>next question</span>
      </div>

    </div>
  )
}