import './options.css'

export function Options({ options, onSelect }) {
    return (
        <div id="options-container">
            {options.map((option, index) => {
                console.log("option data:", option);
                const [label, , , icon] = option;
                console.log("icon path:", icon);
                return (
                    <button key={index} className="option" onClick={() => onSelect(index)}>
                    {icon && <img src={`/answer-icons/${icon}`} />}
                    <span>{label}</span>
                    </button>
                );
            })}
        </div>
    )
}