import "./page.css";

export default function LobbyScreen({ lobbyState, myPedestalIndex }) {
  return (
    <div className="app-container">
      <div id="content-container">
        <h1>Waiting for players...</h1>
        <p>Tap your RFID token to choose your character</p>

        <div className="player-slots">
          {[0, 1, 2, 3].map((slot) => {
            const isConnected = lobbyState.connectedSlots.includes(slot);
            const player = lobbyState.players?.[slot];
            const isMe = slot === myPedestalIndex;

            return (
              <div
                key={slot}
                className={`slot
                  ${isConnected ? "slot--connected" : "slot--empty"}
                  ${isMe ? "slot--me" : ""}
                  ${player?.hasCharacter ? "slot--ready" : ""}
                `}
              >
                {player?.hasCharacter ? (
                  <>
                    <img
                      src={`/characters/${player.image}`}
                      alt={player.species}
                    />
                    <span>{player.species}</span>
                    {isMe && <span className="slot-you-label">YOU</span>}
                  </>
                ) : isConnected ? (
                  <span>
                    Tap RFID to select character{isMe ? " (YOU)" : ""}
                  </span>
                ) : (
                  <span>Waiting for player {slot + 1}...</span>
                )}
              </div>
            );
          })}
        </div>

        {lobbyState.status === "ready" && (
          <p className="lobby-ready">All players ready! Starting soon...</p>
        )}
      </div>
    </div>
  );
}
