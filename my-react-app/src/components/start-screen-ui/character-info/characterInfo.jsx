import './characterInfo.css';
import itembg from '/UI_Assets/Character_Select/ItemBoard.png'

export function CharacterInfo({ character, onComplete }) {
    const playerPortrait = character?.portrait ? `/UI_Assets/Character_Select/Large_Portraits/${character.portrait}` : null;
    const playerNameBoard = character?.nameBoard ? `/UI_Assets/Character_Select/Character_Name_Boards/${character.nameBoard}` : null;
    // const playerInfoBoard = character?.heroInfoBoard ? `/UI_Assets/Character_Select/Character_Info_Boards/${character.heroInfoBoard}` : null;

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
                    <img className='item-bg' src={itembg} alt="" />
                </div>
            </div>
                
        </div>
    );
}