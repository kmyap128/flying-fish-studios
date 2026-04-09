import "./options.css";

export function Options({ options, onSelect }) {
  return (
    <div id="options-container">
      {options.map(([key, option], index) => {
        const [label, , , icon] = option;
        return (
          <button key={index} className="option" onClick={() => onSelect(key)}>
            {icon && <img src={`/answer-icons/${icon}`} />}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
