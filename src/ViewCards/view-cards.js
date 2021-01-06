import React from "react";
import CardContext from "../card-context";
import Flashcard from "./flashcard";
import { getCardsForDeck, getDeckFromId } from "../misc-functions";

export default class ViewCard extends React.Component {
  constructor() {
    super();

    this.state = {
      showAnswer: false,
      cardNumber: 1,
    };
  }
  
  static contextType = CardContext;

  handleNext(e) {
    e.preventDefault();
    return this.setState({
      cardNumber: this.state.cardNumber + 1,
    });
  }

  handleBack(e) {
    e.preventDefault();
    this.setState({ cardNumber: this.state.cardNumber - 1 });
  }

  getCurrentCard() {
    const cards = this.context.cards;
    const { deckId } = this.props.match.params;
    const cardsInDeck = getCardsForDeck(cards, deckId);
    let currentCard = cardsInDeck.filter(
      (card) => card.cardNumber === this.state.cardNumber
    );

    return currentCard[0];
  }

  render() {
    const decks = this.context.decks;
    const { deckId } = this.props.match.params;
    const cards = getCardsForDeck(this.context.cards, deckId);
    const deck = getDeckFromId(deckId, decks);
    return (
      <>
        <h2>{deck.name}</h2>
        <div
          onClick={() => {
            this.setState({ showAnswer: !this.state.showAnswer });
          }}
        >
          <Flashcard
            card={this.getCurrentCard()}
            history={this.props.history}
            nextCard={this.handleNext}
            showAnswer={this.state.showAnswer}
            deck={deckId}
          />
        </div>
        {this.state.cardNumber < cards.length && (
          <button onClick={(e) => this.handleNext(e)}>Next</button>
        )}
        {this.state.cardNumber > 1 && (
          <button onClick={(e) => this.handleBack(e)}>Back</button>
        )}
      </>
    );
  }
}


