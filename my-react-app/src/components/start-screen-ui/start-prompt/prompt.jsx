import './prompt.css'
import itemBoard from '/UI_Assets/Character_Select/ItemBoard.png'


export function StartPrompt({ waiting }) {
    const path = '/UI_Assets/Title_Screen'
    return (   
        <div className="start-prompt-container">
            <div className='header'>
                 <img src={`${path}/Text/Title_Mythborn.gif`} alt="" />
            </div>
            <div className='icons'>
                <img src={`${path}/Portraits/GIFs/Finley_Shadow.gif`} alt="" />
                <img src={`${path}/Portraits/GIFs/Smoulder_Shadow.gif`} alt="" />
                <img src={`${path}/Portraits/GIFs/Sprig_Shadow.gif`} alt="" />
                <img src={`${path}/Portraits/GIFs/Waddles_Shadow.gif`} alt="" />
            </div>
            <div className='subtext'>
                <img src={waiting ?`${path}/Text/SubtextWaiting.png` : `${path}/Text/Subtext.png`} alt="" />
            </div>
        </div>
    );
}