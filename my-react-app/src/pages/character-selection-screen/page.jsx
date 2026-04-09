import "./page.css";
import { useState, useEffect } from "react";
import { StartPrompt } from "../../components/start-screen-ui/start-prompt/prompt.jsx";
import { CharacterInfo } from "../../components/start-screen-ui/character-info/characterInfo.jsx";

export default function CharacterSelectionScreen( { onComplete } ) {
  const [stage, setStage] = useState('prompt'); 
  const [shaking, setShaking] = useState(false);
  const character = {
    name: "Sprig",
    species: "The Jubilant Jackalope",
    image: "sprig.png",
    animation: "sprig.gif",
    bio: "bio about sprig",
    itemImage: "",
    item: "item name",
    itemDescription: "description of the item"
  };
  const handlePromptClick = () => {
      setStage("image");
      setShaking(true);
    };

    useEffect(() => {
      if (stage !== "image") return;

      const shakeTimer = setTimeout(() => setShaking(false), 600);
      const switchTimer = setTimeout(() => setStage("character"), 1200);

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(switchTimer);
      };
    }, [stage]);

  return (
    <div className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/character-select.png)`,
        backgroundSize: "cover",
      }}>
      <div id="content-container">
        {stage === "prompt" && (
          <div onClick={handlePromptClick} style={{ cursor: "pointer" }}>
            <StartPrompt />
          </div>
        )}

        {stage === "image" && (
          <div className="egg-anim">
            <img
              src="/assets/effect.png"
              alt="character"
              className="effect"
            />
            <img
              src="/assets/egg.png"
              alt="transition"
              className={`egg ${shaking ? "shake" : ""}`}
            />
          </div>
        )}

        {stage === "character" && (
          <CharacterInfo
            character={character}
            onComplete={() => onComplete(character)}  
          />
        )}
      </div>
    </div>
  )
}