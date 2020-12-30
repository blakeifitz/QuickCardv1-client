import React from 'react';

const CardContext = React.createContext({
    notes:"",
    decks: [],
    cards:[],
    commitCards: () => {},
    commitDeck: () => {},
    deleteDeck: () => {},
    deleteCard: () => {},
    updateDeck: () => {},
    updateCard: () => {},
})

export default CardContext