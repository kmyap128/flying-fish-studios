import "./page.css";
import { useState, useEffect } from "react";
import { StartPrompt } from "../../components/start-screen-ui/start-prompt/prompt.jsx";
import { CharacterInfo } from "../../components/start-screen-ui/character-info/characterInfo.jsx";

export default function CharacterSelectionScreen({
  onComplete,
  myPlayer,
  socket,
}) {
  const [pendingCharacterStage, setPendingCharacterStage] = useState(false);
  const [stage, setStage] = useState("prompt");
  const [shaking, setShaking] = useState(false);
  const [allTapped, setAllTapped] = useState(false);

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
    if (!socket) return;
    socket.on("allCharactersAssigned", () => {
      setAllTapped(true);
      setPendingCharacterStage(true);
    });
    return () => socket.off("allCharactersAssigned");
  }, [socket]);

  useEffect(() => {
    if (stage !== "image") return;

    const shakeTimer = setTimeout(() => setShaking(false), 600);

    const switchTimer = allTapped
      ? setTimeout(() => setStage("character"), 2000)
      : null;

    return () => {
      clearTimeout(shakeTimer);
      if (switchTimer) clearTimeout(switchTimer);
    };
  }, [stage, allTapped]);

  useEffect(() => {
    if (!allTapped) return;
    if (stage === "image") {
      return;
    }
    if (pendingCharacterStage && myPlayer?.species) {
      setStage("character");
      setPendingCharacterStage(false);
    }
  }, [allTapped, pendingCharacterStage, myPlayer]);

  useEffect(() => {
    if (pendingCharacterStage && myPlayer?.species) {
      setStage("character");
      setPendingCharacterStage(false);
    }
  }, [pendingCharacterStage, myPlayer]);

  // useEffect(() => {
  //   if (stage !== "character") return;
  //   const readyTimer = setTimeout(() => {
  //     socket.emit("playerReady");
  //   }, 10000);
  //   return () => clearTimeout(readyTimer);
  // });

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("fullRestart", () => {
  //     console.log("🔄 fullRestart received in CharacterSelectionScreen");
  //     setStage("prompt");
  //   });
  //   return () => socket.off("fullRestart");
  // }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameStarting", () => {
      console.log("🎮 gameStarting received in CharacterSelectionScreen");
      onComplete(myPlayer);
    });
    return () => socket.off("gameStarting");
  }, [socket, myPlayer]);

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
