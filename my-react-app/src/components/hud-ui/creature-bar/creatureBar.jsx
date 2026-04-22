import './creatureBar.css'

export function CreatureBar({ image }) {
  return (
    <div className="creature-wrapper">
      <img className="creature-bg" src={image} alt="" />
      <div className="creature-content">
        <div className="item-bar">
          <div className="item" />
          <div className="item" />
        </div>
      </div>
    </div>
  )
}