import { Header } from '../components/header'
import { ScenarioOption } from '../components/scenarioOption'
import { Options } from '../components/options.jsx'
import bg from '../media/assets/backgrounds/sad-cheese-seller.jpg'
import jackalope from '../media/assets/characters/jackalope.png'
import './page.css'

export default function ScenarioScreen() {
  const options = [
    "Sample the cheese",
    "Question his suspicious business practices",
    "Help redesign his cheese stand"
  ]
  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div id="content-container">
        <Header image={jackalope} creatureName={'Jackalope'} timerStart={10} scenarioNumber={1} />
        <ScenarioOption 
          title="The Sad Cheese Seller"
          description="A tiny mouse chef sits behind a lonely cheese cart. “No one believes in artisanal forest cheese anymore…”"
        />  
        <Options options={options} />
      </div>
    </div>
  )
}