import './wizardBar.css'
import wizardBg from '/UI_Assets/Corner_UI/WG_Scenario/WG_UI.png' 

function getFillImage(percent) {
  const step = Math.min(Math.ceil(percent / 10) * 10, 100)
  return `/UI_Assets/Corner_UI/WG_Scenario/fill/fill_${step}.png`
}

export function WizardBar({ wizardsGrasp, scenarioNumber, totalScenarios = 6 }) {
  const maxValue = 15;
  const fillPercent = Math.round((wizardsGrasp / maxValue) * 100);
  const fillImage = getFillImage(fillPercent);

  return (
    <div className="wizard-wrapper">
      <img className="wizard-bg" src={wizardBg} alt="" />
      <div className="wizard-content">

        <div className="wizard-bar-area">
          {fillImage && (
            <img className="wizard-fill-img" src={fillImage} alt="" />
          )}
        </div>

        <div className="wizard-diamond">
          <p className="wizard-percent">{fillPercent}%</p>
        </div>

        <div className="wizard-scenario">
          <p className="wizard-scenario-text">{scenarioNumber}/{totalScenarios}</p>
        </div>

      </div>
    </div>
  )
}