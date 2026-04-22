import './prompt.css'
import itemBoard from '/UI_Assets/Character_Select/ItemBoard.png'

export function StartPrompt() {
    return (   
        <div className="start-prompt-container">
            <img className='prompt-bg' src={itemBoard} alt="Item Board" />
            <div className="start-prompt">
                <p>CHARACTER SELECT</p>
                <p>PLACE EGG TO BEGIN</p>
            </div>
        </div>
    );
}