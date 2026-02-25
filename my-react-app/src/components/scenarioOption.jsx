import './scenarioOption.css'

export function ScenarioOption({ title, description }) {
  return (
    <div id="scenario-option-container">
        <p id="scenario-option-name">{title}</p>
        <p id="scenario-option">
            {description}
        </p>
        <div className="line-dot-line">
          <span className="left-line" />
          <span className="dot" />
          <span className="right-line" />
        </div>
    </div>
  )
}