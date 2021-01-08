import React from "react";
import CardContext from "../card-context";
import Flashcard from "./flashcard";
import { getCardsForDeck} from "../misc-functions";
import "./view-cards.css";

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
            nextCard={this.handleNext}
            showAnswer={this.state.showAnswer}
            deck={deckId}
          />
        </div>
        <div className="card-buttons">
          {this.state.cardNumber < cards.length && (
            <button onClick={(e) => this.handleNext(e)}>Next</button>
          )}
          <button
            onClick={() => {
              this.setState({ showAnswer: !this.state.showAnswer });
            }}
          >
            Flip
          </button>
          {this.state.cardNumber > 1 && (
            <button onClick={(e) => this.handleBack(e)}>Back</button>
          )}
        </div>
      </>
    );
  }
}
