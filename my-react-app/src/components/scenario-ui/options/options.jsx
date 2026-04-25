import { useRef } from "react";
import "./options.css";
import optionBg from "/UI_Assets/Containers/Answer_Container.png";

export function Options({ options, onSelect, myChoice }) {
  // If only 2 options, inject a blank disabled one in the middle
  const displayOptions =
    options.length === 2
      ? [options[0], ["__blank__", [" ", null, null, null]], options[1]]
      : options;

  const choiceSelection = "/sounds/sound-effects/Choice_Selection.mp3";
  const selectSoundRef = useRef(null);

  return (
    <div id="options-container">
      <audio ref={selectSoundRef} src={choiceSelection} preload="auto" />

      {displayOptions.map(([key, option]) => {
        const isNestedOption = Array.isArray(option[1]);
        const label = option[0];
        const icon = isNestedOption ? option[1][2] : option[3];

        const isBlank = key === "__blank__";
        const isMyChoice = myChoice === key;

        return (
          <button
            key={key}
            className={`option ${isMyChoice ? "option--chosen" : ""} ${(myChoice && !isMyChoice) || isBlank ? "option--disabled" : ""}`}
            onClick={() => {
              if (myChoice || isBlank) return;
              if (selectSoundRef.current) {
                selectSoundRef.current.currentTime = 0;
                selectSoundRef.current
                  .play()
                  .catch((err) => console.warn("Autoplay blocked", err));
              }
              onSelect(key);
            }}
            disabled={(myChoice && !isMyChoice) || isBlank}
          >
            <img className="option-bg" src={optionBg} alt="" />
            <div className="option-button-content">
              {icon && (
                <img
                  className="option-icon"
                  src={`/answer-icons/${icon}`}
                  alt=""
                />
              )}
              {!isBlank && <span className="option-label">{label}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
