import './characterInfo.css';

export function CharacterInfo({ character, onComplete }) {
    const playerPortrait = character?.portrait ? `/Character_Select/Large_Portraits/${character.portrait}` : null;
    const playerNameBoard = character?.nameBoard ? `/Character_Select/Character_Name_Boards/${character.nameBoard}` : null;

    return (
        <div className="character-info-container" onClick={onComplete} style={{ cursor: "pointer" }}>
            <div className="character-image">
                <img src={playerPortrait} alt={character.name} />
            </div>

            <div className='character-profile'>
                <div className="character-name">
                    <img src={playerNameBoard} alt={character.name} />
                </div>
                <div className="character-bio">
                    <p>{character.desciption}</p>
                </div>
                <div className='character-item'>
                    {/* <img src={`/item-icons/${character.item.icon}`} alt={character.item.name} /> */}
                    <p className='item-name'>{character.item}</p>
                    {/* <p className='item-description'>{character.itemDescription}</p> */}
                </div>
            </div>
                
        </div>
    );
}