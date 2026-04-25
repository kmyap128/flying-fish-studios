import "./page.css";
import { useState, useEffect } from "react";
import { StartPrompt } from "../../components/start-screen-ui/start-prompt/prompt.jsx";
import { CharacterInfo } from "../../components/start-screen-ui/character-info/characterInfo.jsx";

export default function CharacterSelectionScreen({
  onComplete,
  myPlayer,
  myRole,
  socket,
}) {
  const [stage, setStage] = useState("prompt");
  const [timerWidth, setTimerWidth] = useState(100);

  useEffect(() => {
    if (!socket) return;
    socket.on("playerTapped", () => {
      if (stage === "prompt") setStage("waiting");
    });
    socket.on("allPlayersReady", () => {
      setStage("hatching");
    });
    return () => {
      socket.off("playerTapped");
      socket.off("allPlayersReady");
    };
  }, [socket, stage]);

  // Hatching gif plays, then move to impostor reveal
  useEffect(() => {
    if (stage !== "hatching") return;
    const t = setTimeout(() => setStage("impostor"), 4000);
    return () => clearTimeout(t);
  }, [stage]);

  // Impostor gif plays for 5s, then reveal
  useEffect(() => {
    if (stage !== "impostor") return;
    const t = setTimeout(() => setStage("reveal"), 5000);
    return () => clearTimeout(t);
  }, [stage]);

  // Reveal: 10s countdown then start game
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
  const infoImage = myRole?.isImpostor ? "Traitor_Block.png" : myPlayer?.infoBlock;

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/forest-day.png)`,
        backgroundSize: "cover",
      }}
    >
      <div id="content-container">
        {stage === "prompt" && <StartPrompt waiting={false} />}

        {stage === "waiting" && <StartPrompt waiting={true} />}

        {stage === "hatching" && myPlayer && (
          <div className="egg-anim">
            <img
              src={`/UI_Assets/Character_Select/Egg_Anims/${myPlayer.name}-hatch.gif`}
              alt="hatching"
              className="hatch-gif"
            />
          </div>
        )}

        {stage === "impostor" && (
          <div className="impostor-reveal">
            <CharacterInfo
              character={{ ...myPlayer, infoBlock: initImage }}
              onComplete={() => onComplete(myPlayer)}
            />
            <div
              className="impostor-gif-overlay"
              style={{
                backgroundImage: `url(/UI_Assets/Darken_Screen.png)`,
                backgroundSize: "cover",
              }}
            >
              {myRole?.isImpostor ? (
                <img
                  src="/UI_Assets/Character_Select/Spinner_Traitor.gif"
                  alt="impostor reveal"
                />
              ) : (
                <img
                  src="/UI_Assets/Character_Select/Spinner_Hero.gif"
                  alt="hero reveal"
                />
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
          </div>
        )}
      </div>
    </div>
  );
}