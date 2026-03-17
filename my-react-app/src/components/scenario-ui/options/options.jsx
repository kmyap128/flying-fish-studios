import './options.css'

export function Options({ options, onSelect }) {
    return (
        <div id="options-container">
            {options.map((option, index) => (
                <button key={index} className="option" onClick={() => onSelect(index)}>
                    {option}
                </button>
            ))}
        </div>
    )
}