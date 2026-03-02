import './scenarioBlock.css'

export function ScenarioBlock({ title, description }) {
  return (
    <div id="scenario-container">
        <p id="scenario-name">{title}</p>
        <p id="scenario">
            {description}
        </p>
    </div>
  )
}