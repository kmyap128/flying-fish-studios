import './options.css'

export function Options({ options, onSelect }) {
    return (
        <div id="options-container">
            {options.map((option, index) => {
                const [label, , , icon] = option;
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