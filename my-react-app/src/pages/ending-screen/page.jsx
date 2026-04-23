import "./page.css";
import { useState, useEffect } from "react";


export default function EndingScreen({
  gameResult,
}) {


  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(/backgrounds/forest-day.png)`,
        backgroundSize: "cover",
      }}
    >
      <div id="content-container">
        {gameResult === "win" && (
          <div className="win-screen">
            <h1>YOU WIN!</h1>
          </div>
        )}

        {gameResult === "lose" && (
          <div className="lose-screen">
            <h1>YOU LOSE!</h1>
          </div>
        )}
      </div>
    </div>
  );
}