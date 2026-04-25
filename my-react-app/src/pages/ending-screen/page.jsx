import "./page.css";
import { useState, useEffect } from "react";


export default function EndingScreen({
  gameResult,
}) {
  const { result, isImpostor, allPlayers } = gameResult;
  console.log("Game Result:", result);
  console.log("Is Impostor:", isImpostor);
  console.log("All Players with Roles:", allPlayers);

  const banner = result === "win"
    ? "/UI_Assets/Final_Results/Victory_Banner.png"
    : "/UI_Assets/Final_Results/Defeat_Banner.png";

  const getImagePath = (player, isImpostor) => {
    const fullName = player.name; 
    const shortName = player.name.slice(0, 3); 

    let traitor;
    let state;
    if (player.isImpostor) {
      traitor = "Traitor";
    } else {
      traitor = "Hero";
    }

    if (isImpostor) {
      if (player.isImpostor) {
        if (result === "win") {
          state = "Victory";
        } else {
          state = "Defeat";
        }
      } else {
        state = "Default";
      }
    } else {
      if (!player.isImpostor) {
        if (result === "win") {
          state = "Victory";
        } else {
          state = "Defeat";
        }
      } else {
        state = "Default";
      }
    }

    return `/UI_Assets/Final_Results/Character_Banners/${fullName}/${shortName}_${traitor}_${state}.png`;
  };

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
          <div className="win-screen">
            <div className="header">
              <img src={banner} alt="" />
            </div>
            <div className="prompt">
              { isImpostor
                ? (result === "win"
                    ? <img src="/UI_Assets/Final_Results/Traitor_victory.png" alt="" />
                    : <img src="/UI_Assets/Final_Results/Traitor_defeat.png" alt="" />
                  )
                : (result === "win"
                    ? <img src="/UI_Assets/Final_Results/Hero_victory.png" alt="" />
                    : <img src="/UI_Assets/Final_Results/Hero_Defeat.png" alt="" />
                  )
              }
            </div>
            <div className="icons">
              {isImpostor ? (
                <>
                  <img src={`${getImagePath(allPlayers[0], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[1], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[2], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[3], isImpostor)}`} alt="" />
                </>
              ) : (
                <>
                  <img src={`${getImagePath(allPlayers[0], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[1], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[2], isImpostor)}`} alt="" />
                  <img src={`${getImagePath(allPlayers[3], isImpostor)}`} alt="" />
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}