export const getCardsForDeck = (cards = [], deckId) => {
  cards = cards.filter((card) => card.deck.toString() === deckId);
  cards.map((card, i) => (card.cardNumber = i + 1));
  return cards;
};

export const getDeckFromId = (deckId, decks) => {
let  deck = decks.filter((deck) => deck === deckId);

if (deck){
  return
}else
return null
};
