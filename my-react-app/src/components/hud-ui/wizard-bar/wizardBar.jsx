import './wizardBar.css'

export function WizardBar({ wizardsGrasp }) {
  const maxValue = 15;
  const fillPercent = (wizardsGrasp / maxValue) * 100;

  return (
    <div className="wizard-bar">
      <div 
          className="wizard-fill"
          style={{ width: `${fillPercent}%` }}
      />
      <span className="wizard-text">{Math.round(fillPercent)}%</span>
    </div>
  )
}