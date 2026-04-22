import blockBg from '/UI_Assets/Containers/Scenario_Container_Large.png'
import optionBg from '/UI_Assets/Containers/Scenario_Container_Small.png'

export default function ScenarioCard({ title, description, variant = 'block', exiting = false }) {

  return (
    variant === 'block' ? (
      <div className={`scenario-card scenario-card--${variant} ${exiting ? 'scenario-card--exit' : ''}`} >
        <img className="scenario-card-bg" src={blockBg} alt="" />
        <div className="scenario-card-content">
          <p className="scenario-name">{title}</p>
          <p className="scenario">{description}</p>
        </div>
      </div>
    ) : (
    <div className={`scenario-card scenario-card--${variant} ${exiting ? 'scenario-card--exit' : ''}`} >
      <img className="scenario-card-bg" src={optionBg} alt="" />
      <div className="scenario-card-content">
        <p className="scenario-name">{title}</p>
        <p className="scenario">{description}</p>
        {variant === 'option' && (
          <div className="line-dot-line">
            <span className="left-line" />
            <span className="dot" />
            <span className="right-line" />
          </div>
        )}
      </div>
    </div>
  )
)}