import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GameInfo } from "./components/GameInfo";
import { Player } from "./components/Player";
import { DECK } from "./constants/52deck";
import { shuffle, calculateScore } from "./functions/functions";

const DEALER_INDEX = 0;
const INITIAL_PLAYER_TURN = 1;
const INITIAL_GAME_ROUND = 0;
const INITIAL_NUMBER_OF_DECKS = 1;
const INITIAL_NUMBER_OF_PLAYERS = 3;

const initializePlayersHand = (numberOfPlayers) => {
  let hands = [{ player: "Dealer", card: [] }];
  for (let i = 0; i < numberOfPlayers; i++) {
    hands.push({
      player: `Player ${i + 1}`,
      card: [],
      score: 0,
      bet: 10,
    });
  }
  return hands;
};

function App() {
  const deck = useRef([...DECK]);
  const [count, setCount] = useState(0);
  const [trueCount, setTrueCount] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(INITIAL_PLAYER_TURN);
  const [gameRound, setGameRound] = useState(INITIAL_GAME_ROUND);
  const [numberOfDecks, setNumberOfDecks] = useState(INITIAL_NUMBER_OF_DECKS);
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    INITIAL_NUMBER_OF_PLAYERS
  );
  const [winnedChips, setWinnedChips] = useState(0);
  const [winnerProcess, setWinnerProcess] = useState(false);
  const [playersHand, setPlayersHand] = useState(() =>
    initializePlayersHand(numberOfPlayers)
  ); /* [{player: "Dealer", card: [{ number: "1", display: "A", value: 1, suit: "hearts" }, { number: "8", display: "8", value: 8, suit: "hearts" }], score: 19}]*/

  /* Función para repartir cartas. Pasas las manos actuales (Que incluyen los jugadores totales) y el deck restante que te queda. Añade una carta nueva a cada mano*/
  const deal = (playerIndex, deck) => {
    setPlayersHand((prev) => {
      return prev.map((hand, index) => {
        if (index === playerIndex) {
          const newCard = deck.current.pop();
          handleCount(newCard);
          const newHand = {
            ...hand,
            card: [...hand.card, newCard],
            score: calculateScore([...hand.card, newCard]),
          };
          return newHand;
        }
        return hand;
      });
    });
  };
  const addDeck = () => {
    deck.current = [...deck.current, ...DECK];
    setNumberOfDecks(numberOfDecks + 1);
  };
  /*Añade un nuevo jugador a la mesa y un nuevo objeto al estado al estado con las manos de los jugadores */
  const handleAddPlayer = () => {
    setNumberOfPlayers(numberOfPlayers + 1);
    setPlayersHand((prev) => {
      const newHand = [...prev];
      newHand.push({
        player: `Player ${numberOfPlayers + 1}`,
        card: [],
        score: 0,
        bet: 10,
      });
      return newHand;
    });
  };
  /*Elimina un jugador de la mesa y un objeto del estado con las manos de los jugadores */
  const handleRemovePlayer = () => {
    setNumberOfPlayers(numberOfPlayers - 1);
    setPlayersHand((prev) => {
      const newHand = [...prev];
      newHand.pop();
      return newHand;
    });
  };
  /*Elimina las cartas de todos los jugadores */
  const cleanTable = () => {
    setPlayersHand((prev) => {
      return prev.map((hand) => ({ ...hand, card: [] }));
    });
  };
  /*Funcion para iniciar cada turno. Elimina las cartas actuales de las manos de los jugadores, pone el turno 1 y reparte dos cartas a cada jugador*/
  const handleDeal = () => {
    setPlayerTurn(1);
    deck.current = shuffle(deck.current);
    for (let j = 0; j <= numberOfPlayers; j++) {
      deal(j, deck);
    }
  };
  const handleNextRound = () => {
    setPlayerTurn(1);
    cleanTable();
    setGameRound(gameRound + 1);
    setWinnerProcess(false);
  };
  const handleAddDeck = () => {
    addDeck();
    setTrueCount(count / (deck.current.length / 52));
  };
  const handleShuffle = () => {
    cleanTable();
    deck.current = [];
    setCount(0);
    setTrueCount(0);
    for (let i = 0; i < numberOfDecks; i++) {
      deck.current = [...deck.current, ...DECK];
    }
    handleDeal();
    handleDeal();
  };
  const startNewGame = () => {
    deck.current = shuffle([...DECK]);
    setPlayersHand(initializePlayersHand(numberOfPlayers));
    setPlayerTurn(INITIAL_PLAYER_TURN);
    setGameRound(INITIAL_GAME_ROUND);
    setNumberOfDecks(INITIAL_NUMBER_OF_DECKS);
    setWinnerProcess(false);
    setWinnedChips(0);
    setCount(0);
    setTrueCount(0);
    // Deal initial cards
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j <= numberOfPlayers; j++) {
        deal(j, deck);
      }
    }
  };
  const determineWinner = () => {
    const dealerScore = playersHand[DEALER_INDEX].score;
    const results = playersHand.map((hand, index) => {
      if (index === DEALER_INDEX) return "dealer";
      if (hand.score === 21 && hand.card.length === 2) {
        return `${hand.player} wins with blackjack`;
      }
      if (hand.score > 21 || (dealerScore <= 21 && dealerScore >= hand.score)) {
        return `${hand.player} loses`;
      } else {
        return `${hand.player} wins`;
      }
    });
    const chipsWon = results.reduce((total, result) => {
      if (result.includes("wins")) {
        if (result.includes("blackjack")) {
          return (
            total +
            playersHand.find(
              (hand) => hand.player === result.split(" ").slice(0, 2).join(" ")
            ).bet *
              1.5
          );
        } else {
          return (
            total +
            playersHand.find(
              (hand) => hand.player === result.split(" ").slice(0, 2).join(" ")
            ).bet
          );
        }
      }
      return total;
    }, 0);
    const chipLost = results.reduce((total, result) => {
      if (result.includes("loses")) {
        return (
          total +
          playersHand.find(
            (hand) => hand.player === result.split(" ").slice(0, 2).join(" ")
          ).bet
        );
      }
      return total;
    }, 0);
    setWinnedChips((prev) => prev + chipsWon - chipLost);
  };
  const handleCount = (card) => {
    if (card.value >= 2 && card.value <= 6) {
      setCount(count + 1);
    } else if (card.value === 10 || card.value === 1) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    const handleTrueCount = () => {
      setTrueCount(count / (deck.current.length / 52));
    };
    handleTrueCount();
  }, [count]);

  //Funcion para repartir cartas al dealer si su score es menor a 17
  useEffect(() => {
    if (playerTurn === 0 && winnerProcess === false) {
      const dealer = playersHand[0];
      if (dealer.score < 17) {
        deal(0, deck);
      } else {
        determineWinner();
        setWinnerProcess(true);
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [playerTurn, playersHand]);

  //Funcion para repartir las cartas cuando carga la pagina
  useEffect(() => {
    handleDeal();
    handleDeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRound]);

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          width: "80vw",
          color: "#dbe4df",
        }}
      >
        <h1>Card counter player</h1>
      </nav>
      <h3 style={{ margin: "auto", textAlign: "center", color: "#dbe4df" }}>
        Learn how to count cards in blackjack by doing it
      </h3>
      <section className="blackjackTable">
        <GameInfo
          gameRound={gameRound}
          numberOfPlayers={numberOfPlayers}
          deck={deck}
          numberOfDecks={numberOfDecks}
          handleAddDeck={handleAddDeck}
          winnedChips={winnedChips}
          count={count}
          trueCount={trueCount}
        />
        <Player
          hand={playersHand[0]}
          deck={deck}
          turn={playerTurn}
          setPlayerTurn={setPlayerTurn}
          playersHand={playersHand}
          setPlayersHand={setPlayersHand}
          numberOfPlayers={numberOfPlayers}
          handleNextRound={handleNextRound}
        >
          Dealer
        </Player>
        <div className="players-zone">
          <button onClick={handleRemovePlayer}>-</button>
          {playersHand.slice(1).map((hand, index) => (
            <Player
              key={index}
              hand={hand}
              deck={deck}
              turn={playerTurn}
              setPlayerTurn={setPlayerTurn}
              playersHand={playersHand}
              setPlayersHand={setPlayersHand}
              numberOfPlayers={numberOfPlayers}
              handleCount={handleCount}
            >
              {hand.player}
            </Player>
          ))}
          <button onClick={handleAddPlayer}>+</button>
        </div>
      </section>
      <div className="table-actions">
        <button onClick={handleDeal}>Deal</button>
        <button onClick={handleShuffle}>Shuffle</button>
        <button onClick={handleAddDeck}>Add Deck</button>
        <button onClick={startNewGame}>Reset</button>
      </div>
    </>
  );
}

export default App;
