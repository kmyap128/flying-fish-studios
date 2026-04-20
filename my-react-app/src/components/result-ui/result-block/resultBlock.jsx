import './resultBlock.css';
import { useEffect, useRef } from 'react';
import { TimerMeter } from '../../hud-ui/timer-meter/timerMeter.jsx';

export function ResultBlock({ scenarioNum, resultText, countdown, timerDuration }) {   
  return (
    <div className="result-content">

      <div className="top-section">
        <p className="scenario-label">Scenario {scenarioNum}</p>
        <p className="result-text">{resultText}</p>
      </div>

      <div className="mid-section">
        <div className="character-panel">
          <img src="/characters/finley.png" alt="Finley" />
          <img src="/characters/smoulder.png" alt="Smoulder" />
          <img src="/characters/sprig.png" alt="Sprig" />
          <img src="/characters/waddles.png" alt="Waddles" />
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