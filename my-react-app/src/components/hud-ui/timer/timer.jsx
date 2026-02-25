import { useEffect, useState, useRef } from "react";
import "./timer.css";

export function Timer({ timerStart, scenarioNumber }) {
  const startValue = Number.isFinite(Number(timerStart))
    ? Number(timerStart)
    : 0;

  const [time, setTime] = useState(startValue);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  const tick = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const remaining = Math.max(startValue - elapsed, 0);

    setTime(remaining);

    if (remaining > 0) {
      requestRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    if (startValue <= 0) {
      setTime(0);
      return;
    }

    setTime(startValue);
    startTimeRef.current = null;

    requestRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(requestRef.current);
  }, [startValue]);

  const progress =
    startValue > 0 && Number.isFinite(time)
      ? (time / startValue) * 100
      : 0;

  const safeTime = Number.isFinite(time) ? time.toFixed(2) : "0.00";
  const safeDegrees = (100 - progress) * 3.6;

  return (
    <div className="timer-wrapper">
        <div className="timer-bars-wrapper">
            <div className="timer-bar">
                <p id="timer">{safeTime}</p>
            </div>

            <div className="scenario-bar">
                <p className="scenario-number">
                    Scenario {scenarioNumber ?? ""}
                </p>
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