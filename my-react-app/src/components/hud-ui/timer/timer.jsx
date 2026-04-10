import "./timer.css";
import timerBg from '/UI_Assets/Timer/Timer_Container.png' 

export function Timer({ timerCurrent}) {
  const current = Number.isFinite(Number(timerCurrent)) ? Number(timerCurrent) : 0;

  return (
    <div className="timer-wrapper">
      <div className="timer-circle">
        <img className="timer-bg" src={timerBg} alt="" />
        <div className="timer-content">
          <p className="timer-number">{Math.ceil(current)}</p>
        </div>
      </div>
    </div>
  );
}