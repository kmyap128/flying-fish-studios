import "./page.css";
import { useState, useEffect } from "react";
import { StartPrompt } from "../../components/start-screen-ui/start-prompt/prompt.jsx";
import { CharacterInfo } from "../../components/start-screen-ui/character-info/characterInfo.jsx";

export default function CharacterSelectionScreen({ onComplete, myPlayer }) {
  const [stage, setStage] = useState("prompt");
  const [shaking, setShaking] = useState(false);
  const handlePromptClick = () => {
    setStage("image");
    setShaking(true);
  };

  useEffect(() => {
    if (myPlayer?.species && stage === "prompt") {
      handlePromptClick();
    }
  }, [myPlayer]);

  useEffect(() => {
    if (stage !== "image") return;

    const shakeTimer = setTimeout(() => setShaking(false), 600);
    const switchTimer = setTimeout(() => setStage("character"), 10000);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(switchTimer);
    };
  }, [stage]);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/forest-day.png)`,
        backgroundSize: "cover",
      }}
    >
      <div id="content-container">
        {stage === "prompt" && (
          <div onClick={handlePromptClick}>
            <StartPrompt />
          </div>
        )}

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

        {stage === "character" && (
          <div className="character-info">
            <CharacterInfo
              character={myPlayer}
              onComplete={() => onComplete(myPlayer)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
