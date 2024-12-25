import { useState } from "react";
/* eslint-disable react/prop-types */
export function GameInfo({
  gameRound,
  numberOfPlayers,
  deck,
  numberOfDecks,
  winnedChips,
  count,
  trueCount,
}) {
  const [collapsed, setCollapsed] = useState(true);
  const handleCollapse = () => setCollapsed(!collapsed);
  return (
    <>
      {collapsed ? (
        <div className="game-info">
          <h2>Game Info</h2>
          <button onClick={handleCollapse}>
            {collapsed ? "More info" : "Less Info"}
          </button>
        </div>
      ) : (
        <div className="game-info">
          <div style={{ display: "flex" }}>
            <h2>Game Info</h2>
          </div>
          <div>
            <p>Winned Chips: {winnedChips}</p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Round: {gameRound}</p>
          </div>

          <p>Running count: {count}</p>
          <p>True count: {trueCount}</p>
          <div style={{ display: "flex" }}>
            <p>Number of players: {numberOfPlayers}p</p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Number of Decks:{numberOfDecks}</p>
          </div>
          <p>Remaining cards: {deck.current.length}</p>
          <button onClick={handleCollapse}>
            {collapsed ? "More info" : "Less Info"}
          </button>
        </div>
      )}
    </>
  );
}
