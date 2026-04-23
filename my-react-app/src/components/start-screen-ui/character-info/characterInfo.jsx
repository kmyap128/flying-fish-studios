import "./characterInfo.css";
import itembg from "/UI_Assets/Character_Select/ItemBoard.png";

export function CharacterInfo({ character, onComplete }) {
  if (!character) return null;

  const playerPortrait = character?.portrait
    ? `/UI_Assets/Character_Select/Large_Portraits/${character.portrait}`
    : null;
  const playerNameBoard = character?.nameBoard
    ? `/UI_Assets/Character_Select/Character_Name_Boards/${character.nameBoard}`
    : null;
  // add logic to check for traitor
  // isTraitor ? traitorBlock: infoBlock
  const playerInfoBoard = character?.infoBlock
    ? `/UI_Assets/Character_Select/Bio_Blocks/${character.infoBlock}`
    : null;

  return (
    <div
      className="character-info-container"
      onClick={onComplete}
      style={{ cursor: "pointer" }}
    >
      <div className="character-image">
        <img src={playerPortrait} alt={character.name} />
      </div>

      <div className="character-profile">
        <div className="character-name">
          <img src={playerNameBoard} alt={character.name} />
        </div>
        <div className="character-info">
          <img className="info-bg" src={playerInfoBoard} alt="" />
        </div>
      </div>
    </div>
  );
}
