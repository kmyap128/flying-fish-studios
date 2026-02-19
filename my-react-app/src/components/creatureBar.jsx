import './creatureBar.css'

export function CreatureBar({image}) {
    return (  
        <div className="creature-wrapper">
            <div className="creature-bg">
                <img className="creature-icon" src={image} alt="creature thumbnail" />
            </div>

            <div className="life-bar">
                <div className="life-segment filled"></div>
                <div className="life-segment filled"></div>
                <div className="life-segment filled"></div>
            </div>
        </div>
    )
}   