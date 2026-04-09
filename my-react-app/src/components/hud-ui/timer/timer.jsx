import "./timer.css";

export function Timer({ timerCurrent, timerDuration, scenarioNumber }) {
  const current = Number.isFinite(Number(timerCurrent)) ? Number(timerCurrent) : 0;
  const duration = Number.isFinite(Number(timerDuration)) ? Number(timerDuration) : 1;

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const safeDegrees = (100 - progress) * 3.6;

  return (
    <div className="timer-wrapper">
      <div className="timer-bars-wrapper">
        <div className="timer-bar">
          <p id="timer">{current.toFixed(2)}</p>
        </div>
        <div className="scenario-bar">
          <p className="scenario-number">Scenario {scenarioNumber ?? ""}</p>
        </div>
      </div>
      <div className="timer-diamond">
        <div
          className="timer-fill"
          style={{
            background: `conic-gradient(
              #585858 ${safeDegrees}deg,
              #9D64DD 0deg
            )`,
          }}
        />
      </div>
    </div>
  );
}