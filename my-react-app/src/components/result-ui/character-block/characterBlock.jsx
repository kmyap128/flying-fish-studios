import './characterBlock.css';

export function CharacterBlock({ characterName, itemUsed, isInjured }) {  
    const characterAbbreviation = characterName.slice(0, 1).toUpperCase() + characterName.slice(1, 3).toLowerCase();
    const characterStatus = itemUsed ? "Default" : isInjured ? "Injured" : "Transparent";
    const itemStatus = itemUsed ? "Default" : "Transparent";
    const promptStatus = itemUsed ? "YesProc" : "NoProc";
    const path = `/UI_Assets/Item_Cards/${characterName}`;

    return (
        <div className="character-block-container">
            <div className="character-block">
                <div className='portrait'>
                    <img src={`${path}/Portraits/${characterAbbreviation}_${characterStatus}.png`} alt="" />
                </div>
                <div className='item'>
                    <img src={`${path}/ItemIcons/${characterAbbreviation}_Item_${itemStatus}.png`} alt="" />
                </div>
                <div className='prompt'>
                    {characterName === "Smoulder" ? (
                        <>
                            <img src={`${path}/ItemPrompt/${characterAbbreviation}_${promptStatus}_Per.png`} alt="" />
                            <img className='smoulder-prompt' src={`${path}/ItemPrompt/${characterAbbreviation}_${promptStatus}_Inj.png`} alt="" />
                        </>
                    ) :(
                        <img src={`${path}/ItemPrompt/${characterAbbreviation}_${promptStatus}.png`} alt="" />
                    )}
                </div>
                <div className='score'>
                    {/* change this later per character */}
                    <img src={`${path}/ScoreBanner/${characterAbbreviation}_NoEffect.png`} alt="" />    
                </div>
            </div>
        </div>

    )
}