import './creatureBar.css'

export function CreatureBar({ creatureName, isImpostor, isInjured}) {
  const path = `/UI_Assets/Corner_UI/Character_UI/${creatureName}/${creatureName}_`;

  return (
    <div className="creature-wrapper">
      <img className="creature-bg" src={`${path}${isImpostor ? 'Trait' : 'Hero'}${isInjured ? '_INJ' : ''}.png`} alt={creatureName} />
    </div>
  )
}