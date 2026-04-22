import "./timerMeter.css";
import { useEffect, useRef } from "react";
import timerBg from '/UI_Assets/Timer/Timer_Bar.png';
import timerFill from '/UI_Assets/Timer/Timer_Bar_Fill.png';

export function TimerMeter({ timerCurrent, timerDuration }) {
  const fillRef = useRef(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;

    const percent = (timerCurrent / timerDuration) * 100;

    el.style.transition = 'none';
    el.style.width = `${percent}%`;

    el.getBoundingClientRect();

    el.style.transition = `width ${timerCurrent * 1000}ms linear`;
    el.style.width = '0%';
  }, [timerCurrent, timerDuration]);

  return (
    <div className="timer-meter-wrapper">
      <div className="timer-meter-bar-container">
        <img className="timer-meter-bg" src={timerBg} alt="" />
        <div className="timer-meter-fill-wrapper" ref={fillRef}>
          <img className="timer-meter-fill" src={timerFill} alt="" />
        </div>
      </div>
    </div>
  );
}