import './characterInfo.css';

export function CharacterInfo({ character, onComplete }) {
    return (
        <div className="character-info-container" onClick={onComplete} style={{ cursor: "pointer" }}>
            <div className="character-image">
                <img src={`/characters/${character.animation}`} alt={character.name} />
            </div>

            <div className='character-profile'>
                <div className="character-name">
                    <p>{character.name}</p>
                    <p>{character.species}</p>
                </div>
                <div className="character-bio">
                    <p>{character.bio}</p>
                </div>
                <div className='character-item'>
                    {/* <img src={`/item-icons/${character.item.icon}`} alt={character.item.name} /> */}
                    <p className='item-name'>{character.item}</p>
                    <p className='item-description'>{character.itemDescription}</p>
                </div>
            </div>
                
        </div>
    );
}