import { Header } from '../../components/header-ui/header/header'
import { ScenarioBlock } from '../../components/content-ui/scenario-block/scenarioBlock'
import bg from '../media/assets/backgrounds/sad-cheese-seller.jpg'
import jackalope from '../media/assets/characters/jackalope.png'
import './page.css'

export default function ScenarioScreen() {
  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div id="content-container">
        <Header image={jackalope} creatureName={'Jackalope'} timerStart={5} scenarioNumber={1} />
        <ScenarioBlock 
          title="The Sad Cheese Seller"
          description="A tiny mouse chef sits behind a lonely cheese cart. “No one believes in artisanal forest cheese anymore…”"
        />
      </div>
    </div>
  )
}