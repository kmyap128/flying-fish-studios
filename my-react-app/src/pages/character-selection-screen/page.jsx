import "./page.css";
import { useState, useEffect } from "react";
import { StartPrompt } from "../../components/start-screen-ui/start-prompt/prompt.jsx";
import { CharacterInfo } from "../../components/start-screen-ui/character-info/characterInfo.jsx";
import { TimerMeter } from "../../components/hud-ui/timer-meter/timerMeter.jsx";

export default function CharacterSelectionScreen({
  onComplete,
  myPlayer,
  myRole,
  socket,
}) {
  const [stage, setStage] = useState("prompt");
  const [shaking, setShaking] = useState(false);
  const [timerWidth, setTimerWidth] = useState(100);

  useEffect(() => {
    if (myPlayer?.species && stage === "prompt") {
      setStage("image");
      setShaking(true);
    }
  }, [myPlayer?.species]);

  useEffect(() => {
    if (stage !== "image") return;
    const t = setTimeout(() => setShaking(false), 600);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (!myRole || stage !== "image") return;
    setStage("impostor");
  }, [myRole, stage]);

  useEffect(() => {
    if (stage !== "impostor") return;
    const t = setTimeout(() => setStage("reveal"), 5000);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "reveal") return;

    setTimerWidth(100);
    const startTime = Date.now();
    const duration = 10000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setTimerWidth(remaining * 100);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    const t = setTimeout(() => {
      onComplete(myPlayer);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, [stage]);

  useEffect(() => {
    if (!socket) return;
    socket.on("gameStarting", () => {
      onComplete(myPlayer);
    });
    return () => socket.off("gameStarting");
  }, [socket, myPlayer]);

  const initImage = myPlayer?.infoBlock;

  const infoImage = myRole?.isImpostor
    ? "Traitor_Block.png"
    : myPlayer?.infoBlock;

    console.log("myRole in character selection screen", myRole);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/forest-day.png)`,
        backgroundSize: "cover",
      }}
    >
      <div id="content-container">
        {stage === "prompt" && <StartPrompt />}

        {stage === "image" && (
          <div className="egg-anim">
            <img src="/assets/effect.png" alt="character" className="effect" />
            <img
              src="/assets/egg.png"
              alt="transition"
              className={`egg ${shaking ? "shake" : ""}`}
            />
          </div>
        )}

        {stage === "impostor" && (
          <div className="impostor-reveal" 
          >
            <CharacterInfo
              character={{ ...myPlayer, infoBlock: initImage }}
              onComplete={() => onComplete(myPlayer)}
            />
            <div className="impostor-gif-overlay" 
            style={{
              backgroundImage: `url(/UI_Assets/Darken_Screen.png)`,
              backgroundSize: "cover",
            }}>
              {myRole?.isImpostor ? (
                <img src="/UI_Assets/Character_Select/Spinner_Traitor.gif" alt="impostor reveal" />
              ) : (
                <img src="/UI_Assets/Character_Select/Spinner_Hero.gif" alt="hero reveal" />
              )}
            </div>
          </div>
        )}

        {stage === "reveal" && (
          <div className="character-info">
            <CharacterInfo
              character={{ ...myPlayer, infoBlock: infoImage }}
              onComplete={() => onComplete(myPlayer)}
            />
            {/* <TimerMeter /> */}
          </div>
        )}
      </div>
    </div>
  );
}