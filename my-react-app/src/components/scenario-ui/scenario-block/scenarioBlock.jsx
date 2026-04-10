import './scenarioBlock.css'
import container from '/UI_Assets/Containers/Scenario_Container_Large.png'

export function ScenarioBlock({ title, description }) {
  return (
    <div id="scenario-container">
      <img className="scenario-bg" src={container} alt="" />

      <div className="scenario-content">
        <div className='scenario-text'>
          <p id="scenario-name">{title}</p>
          <p id="scenario">{description}</p>
        </div>
      </div>
    </div>
  )
}