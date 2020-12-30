import React from "react";
import { Route, Link } from "react-router-dom";
import CardContext from "../card-context";
import NewDeck from "../new-deck";
import "./App.css";
import ViewCard from "../ViewCards/view-cards";
import config from "../config";
import ViewDecks from "../ViewDecks/view-decks";

class App extends React.Component {
  state = {
    decks: [],
    cards: [],
  };



  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/deck`),
      fetch(`${config.API_ENDPOINT}/card`),
    ]).then(([deckRes, cardRes]) => {
      if (!deckRes.ok) {
        return deckRes.json().then((e) => Promise.reject(e));
      }
      if (!cardRes.ok) {
        return cardRes.json().then((e) => Promise.reject(e));
      }
      return Promise.all([deckRes.json(), cardRes.json()]);
    })
    .then(([decks, cards]) => {
      this.setState({ decks, cards});
    })
    .catch((error) => {
     console.error({ error })
    })
  }

  handleCommitCards = (cards) => {
    this.setState({
      cards: [...this.state.cards, cards],
    });
  };

  handleCommitDeck = (deck) => {
    this.setState({
      decks: [...this.state.decks, deck],
    });
  };

  handleDeleteCard = (cardId) => {
    this.setState({
      cards: this.state.cards.filter((card) => card.id !== cardId),
    });
  };

  handleDeleteDeck = (deckId) => {
    this.setState({
      decks: this.state.decks.filter((deck) => deck.id !== deckId),
    });
  };

  handleUpdateDeck = (updatedDeck) => {
    this.setState({
      decks: this.state.decks.map(deck => 
        (deck.id !== updatedDeck.id) ? deck : updatedDeck
      )
    })
  }

  handleUpdateCard = (updatedCard, cardId) => {
    this.setState({
      cards: this.state.cards.map(card => 
        (card.id !== cardId) ? card : updatedCard
      )
    })
  }

  renderMain() {
    return (
      <>
        <Route path="/newdeck" component={NewDeck} />
        <Route path="/deck/:deckId" component={ViewCard} />
        <Route exact path="/deck" component={ViewDecks} />
      </>
    );
  }

  render() {
    const context = {
      decks: this.state.decks,
      cards: this.state.cards,
      commitCards: this.handleCommitCards,
      commitDeck: this.handleCommitDeck,
      deleteCard: this.handleDeleteCard,
      deleteDeck: this.handleDeleteDeck,
      updateDeck: this.handleUpdateDeck,
      updateCard: this.handleUpdateCard,
    };
    return (
      <CardContext.Provider value={context}>
        <div className="App">
          <header className="App-header">
            <Link to="/deck">
              <h1>Quick Card</h1>
            </Link>
          </header>
          <main className="AppMain">{this.renderMain()}</main>
        </div>
      </CardContext.Provider>
    );
  }
}

export default App;
