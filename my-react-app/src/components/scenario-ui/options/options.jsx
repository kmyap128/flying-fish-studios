import "./options.css";
import optionBg from "/UI_Assets/Containers/Answer_Container.png";

export function Options({ options, onSelect, myChoice }) {
  return (
    <div id="options-container">
      {options.map(([key, option]) => {
        const [label, , , icon] = option;
        const isMyChoice = myChoice === key;
        // const playersWhoChoseThis = playerChoices.filter(
        //   (p) => p.choice === key,
        // );
        // const isChosen = playersWhoChoseThis.length > 0;
        return (
          <button
            key={key}
            className={`option ${isMyChoice ? "option--chosen" : ""}`}
            onClick={() => onSelect(key)}
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
              <span className="option-label">{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}