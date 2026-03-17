import { Header } from '../../components/hud-ui/header/header.jsx'
import { ScenarioOption } from '../../components/scenario-ui/scenario-option/scenarioOption.jsx'
import { ScenarioBlock } from '../../components/scenario-ui/scenario-block/scenarioBlock.jsx'
import { Options } from '../../components/scenario-ui/options/options.jsx'
import jackalope from '../../media/assets/characters/jackalope.png'
import { WizardBar } from '../../components/hud-ui/wizard-bar/wizardBar.jsx'
import './page.css'
import { useState, useEffect } from 'react'

export default function ReviewScreen() {
  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(/backgrounds/sad-cheese-seller.jpg)` }}
    >
      <div id="content-container">
        <WizardBar value={2} />
        
      </div>
    </div>
  )
}