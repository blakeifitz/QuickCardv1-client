import React from 'react';
import CardContext from '../card-context';
import Flashcard from './flashcard';
import { getCardsForDeck } from '../misc-functions';
import './view-cards.css';

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
      showAnswer: false,
    });
  }

  handleBack(e) {
    e.preventDefault();
    this.setState({ cardNumber: this.state.cardNumber - 1, showAnswer: false });
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
    const { deckId } = this.props.match.params;
    const cards = getCardsForDeck(this.context.cards, deckId);

    return (
      <>
        <div
          onClick={() => {
            this.setState({ showAnswer: !this.state.showAnswer });
          }}
        >
          <Flashcard
            card={this.getCurrentCard()}
            history={this.props.history}
            showAnswer={this.state.showAnswer}
            deck={deckId}
          />
        </div>
        <div className="button_group">
          {this.state.cardNumber > 1 && (
            <button onClick={(e) => this.handleBack(e)}>Back</button>
          )}
          {this.state.cardNumber < cards.length && (
            <button onClick={(e) => this.handleNext(e)}>Next</button>
          )}
          <button onClick={() => this.props.history.push('/deck')}>
            Exit Deck
          </button>
        </div>
      </>
    );
  }
}
