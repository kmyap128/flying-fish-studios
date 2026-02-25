import './creatureBar.css'

export function CreatureBar({ image, creatureName }) {
    return (  
        <div className="creature-wrapper">

            <div className="creature-bg">
                <img className="creature-icon" src={image} alt="creature thumbnail" />
            </div>

            <div className="creature-bars-wrapper">
                <div className="name-bar">
                    <p className='creature-name'>
                        {creatureName}
                    </p>
                </div>

                <div className="item-bar">
                    <div className="item"></div>
                    <div className="item"></div>
                </div>
            </div>

        </div>
    )
}