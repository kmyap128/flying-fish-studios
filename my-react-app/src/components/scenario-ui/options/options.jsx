import './options.css'

export function Options({ options }) {
    return (
        <div id="options-container">
            {options.map((option, index) => (
                <button key={index} className="option">
                    {option}
                </button>
            ))}
        </div>
    )
}