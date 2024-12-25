import { calculateScore } from "../functions/functions";

/* eslint-disable react/prop-types */
export function Player({
  children,
  deck,
  hand,
  turn,
  setPlayerTurn,
  playersHand,
  setPlayersHand,
  numberOfPlayers,
  handleNextRound,
  handleCount,
}) {
  const activePlayer =
    hand["player"].split(" ")[1] == turn ||
    (hand["player"] === "Dealer" && turn === 0);

  let classNamePlayer = "player";

  if (hand["player"] === "Dealer") {
    classNamePlayer += " dealer";
  }
  if (activePlayer) {
    classNamePlayer += " active";
  }

  const handleTurn = () => {
    setPlayerTurn((turn + 1) % (numberOfPlayers + 1));
  };

  const handleHit = () => {
    if (hand["score"] >= 21) return;
    const newHands = playersHand.map((hand, index) => {
      if (index === turn) {
        const newCard = deck.current.pop();
        handleCount(newCard);
        hand["card"].push(newCard);
        hand["score"] = calculateScore(hand["card"]);
      }
      return { ...hand };
    });
    setPlayersHand(newHands);
  };

  const handleAddBet = () => {
    const newHands = playersHand.map((hands) => {
      if (hands["player"] === hand["player"]) {
        return { ...hands, bet: hands["bet"] + 2 };
      } else {
        return hands;
      }
    });
    setPlayersHand(newHands);
  };

  const handleRemoveBet = () => {
    const newHands = playersHand.map((hands) => {
      if (hands["player"] == hand["player"] && hands["bet"] > 2) {
        return { ...hands, bet: hands["bet"] - 2 };
      } else {
        return hands;
      }
    });
    setPlayersHand(newHands);
  };

  return (
    <div className={classNamePlayer}>
      <h2>{children}</h2>
      {hand["player"] !== "Dealer" && (
        <div className="player-bet">
          {turn === 0 && <button onClick={handleRemoveBet}>{"<"}</button>}
          <p>Bet: {hand["bet"]}</p>
          {turn === 0 && <button onClick={handleAddBet}>{">"}</button>}
        </div>
      )}
      <p>
        Score:{" "}
        {hand["player"] == "Dealer" && !activePlayer ? "?" : hand["score"]}
      </p>
      <div className="player-cards">
        {hand["card"].map((card, index) => (
          <div key={index} className="card">
            {hand["player"] == "Dealer" && !activePlayer && index == 0
              ? "🂠"
              : card.display}
          </div>
        ))}
      </div>
      <div className="player-actions">
        {activePlayer && hand["player"] != "Dealer" ? (
          <>
            <button onClick={handleHit}>Hit</button>
            <button onClick={handleTurn}>Stand</button>
          </>
        ) : activePlayer ? (
          <>
            <button onClick={handleNextRound}>Next Round</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
