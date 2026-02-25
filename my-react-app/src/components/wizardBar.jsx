import './wizardBar.css'

export function WizardBar({ value = 15 }) {
  const maxValue = 15;
  const fillPercent = (value / maxValue) * 100;

  return (
    <div className="wizard-bar">
      <div 
          className="wizard-fill"
          style={{ width: `${fillPercent}%` }}
      />
      <span className="wizard-text">{value} / {maxValue}</span>
    </div>
  )
}