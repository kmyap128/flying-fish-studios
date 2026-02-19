import { Header } from '../components/header'
import { ScenarioBlock } from '../components/scenarioBlock'
import bg from '../media/assets/backgrounds/sad-cheese-seller.jpg'
import fish from '../media/assets/characters/fish.png'
import './page.css'

function App() {
  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div id="content-container">
        <Header image={fish} />
        <ScenarioBlock 
          title="The Sad Cheese Seller"
          description="A tiny mouse chef sits behind a lonely cheese cart. “No one believes in artisanal forest cheese anymore…”"
        />
      </div>
    </div>
  )
}

export default App
