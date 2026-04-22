import './scenarioOption.css'
import container from '/UI_Assets/Containers/Scenario_Container_Small.png'

export function ScenarioOption({ title, description }) {
  return (
    <div id="scenario-option-container">
      <img className="scenario-option-bg" src={container} alt="" />

      <div className="scenario-option-content">
        <div className='scenario-option-text'>
          <p id="scenario-option">{description}</p>
        </div>
      </div>
    </div>
  )
}