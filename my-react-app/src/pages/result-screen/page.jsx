import { Header } from "../../components/hud-ui/header/header.jsx";
import { ScenarioOption } from "../../components/scenario-ui/scenario-option/scenarioOption.jsx";
import { ScenarioBlock } from "../../components/scenario-ui/scenario-block/scenarioBlock.jsx";
import { Options } from "../../components/scenario-ui/options/options.jsx";
import jackalope from "../../media/assets/characters/jackalope.png";
import { WizardBar } from "../../components/hud-ui/wizard-bar/wizardBar.jsx";
import "./page.css";
import { useState, useEffect } from "react";

export default function ReviewScreen() {
  return (
    <div
      className="app-container"
      style={{
        backgroundImage: scenarioData
          ? `url(/backgrounds/${scenarioData.media.background})`
          : "none",
      }}
    >
      <div id="content-container">
        <WizardBar value={wizardsGrasp} />

        <h2>Result</h2>

        {winningOption && (
          <div className="wining-option">
            <h3>The group chose: {winningOption[0]}</h3>
            {winningOption[2] && <p>{winningOption[2]}</p>}
          </div>
        )}
        <div className="player-results">
          {playerChoices.map((p) => (
            <div key={p.pedestalIndex} className="player-result">
              <strong>{p.species}</strong>
              <span>{p.choice ?? "No choice"}</span>
              {p.option && <span> - {p.option[0]}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
