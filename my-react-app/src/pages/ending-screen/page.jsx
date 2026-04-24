import "./page.css";
import { useState, useEffect } from "react";


export default function EndingScreen({
  gameResult,
}) {
  const { result, isImpostor, allPlayers } = gameResult;
  console.log("Game Result:", result);
  console.log("Is Impostor:", isImpostor);
  console.log("All Players with Roles:", allPlayers);

  return (

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
        {gameResult.result === "win" && (
          <div className="win-screen">
            <div className="header">
              <img src="/UI_Assets/Final_Results/Victory_Banner.png" alt="" />
            </div>
            <div className="prompt">
              <img src="/UI_Assets/Final_Results/Final_Prompt.png" alt="" />
            </div>
            <div className="icons">
              {isImpostor ? (
                <>
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Finley/Fin_${isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Smoulder/Smo_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Sprig/Spr_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Waddles/Wad_${!isImpostor}.png`} alt="" />
                </>
              ) : (
                <>
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Finley/Fin_${isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Smoulder/Smo_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Sprig/Spr_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Waddles/Wad_${!isImpostor}.png`} alt="" />
                </>
              )}
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
              {isImpostor ? (
                <>
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Finley/Fin_${isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Smoulder/Smo_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Sprig/Spr_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Waddles/Wad_${!isImpostor}.png`} alt="" />
                </>
              ) : (
                <>
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Finley/Fin_${isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Smoulder/Smo_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Sprig/Spr_${!isImpostor}.png`} alt="" />
                  <img src={`/UI_Assets/Final_Results/Character_Banners/Waddles/Wad_${!isImpostor}.png`} alt="" />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}