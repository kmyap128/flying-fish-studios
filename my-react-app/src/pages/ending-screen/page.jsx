import "./page.css";
import { useState, useEffect } from "react";


export default function EndingScreen({
  gameResult,
  players
}) {

  const impostor = players.find(p => p.isImpostor);
  const heroes = players.filter(p => !p.isImpostor);


  return (
    console.log(gameResult, gameResult?.result, gameResult?.isImpostor),
    console.log(players),
    
    console.log("impostor:", impostor),
    console.log("heroes:", heroes),

    <div
      className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/forest-day.png)`,
        backgroundSize: "cover",
      }}
    >
      <div id="content-container"
        style={{
          backgroundImage: `url(/UI_Assets/Darken_Screen.png)`,
          backgroundSize: "cover",
        }}
      >
        {gameResult.result === "win" && gameResult.isImpostor === true && (
          <div className="win-screen">
            <div className="header">
              <img src="/UI_Assets/Final_Results/Defeat_Banner.png" alt="" />
            </div>
            <div className="prompt">
              <img src="/UI_Assets/Final_Results/Final_Prompt.png" alt="" />
            </div>
            <div className="icons">

            </div>
          </div>
        )}

        {gameResult.result === "lose" && (
          <div className="lose-screen">
            <div className="header">
              <img src="/UI_Assets/Final_Results/Defeat_Banner.png" alt="" />
            </div>
            <div className="prompt">
              <img src="/UI_Assets/Final_Results/Final_Prompt.png" alt="" />
            </div>
            <div className="icons">

            </div>
          </div>
        )}
      </div>
    </div>
  );
}