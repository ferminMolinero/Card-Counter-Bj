//Function para barajar el deck
export const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
};

//Function para calcular el score de una mano
export const calculateScore = (hand) => {
    return hand.reduce((acc, card) => {
        if (card.value === 1 && acc + 11 <= 21) {
            return acc + 11;
        } else {
            return acc + card.value;
        }
    }, 0);
};
