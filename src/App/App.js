import React from 'react';
import CardContext from '../card-context';
import NewDeck from '../AddDeck/new-deck';
import './App.css';
import ViewCard from '../ViewCards/view-cards';
import config from '../config';
import ViewDecks from '../ViewDecks/view-decks';
import LandingPage from '../LandingPage/landing-page';
import Header from './Header/header';
import TokenService from '../Services/token-service';
import PrivateRoute from '../Routes/private-route';
import PublicRoute from '../Routes/public-route';
import RegistrationForm from '../LandingPage/signup-form';

class App extends React.Component {
  state = {
    decks: [],
    cards: [],
  };

  handleGetDecks = () => {
    TokenService.hasAuthToken()
      ? Promise.all([
          fetch(`${config.API_ENDPOINT}/deck`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              authorization: `bearer ${TokenService.getAuthToken()}`,
            },
          }),
          fetch(`${config.API_ENDPOINT}/card`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              authorization: `bearer ${TokenService.getAuthToken()}`,
            },
          }),
        ])
          .then(([deckRes, cardRes]) => {
            if (!deckRes.ok) {
              return deckRes.json().then((e) => Promise.reject(e));
            }
            if (!cardRes.ok) {
              return cardRes.json().then((e) => Promise.reject(e));
            }
            return Promise.all([deckRes.json(), cardRes.json()]);
          })
          .then(([decks, cards]) => {
            this.setState({ decks, cards });
          })
          .catch((error) => {
            console.error({ error });
          })
      : this.setState({
          notes: [],
          deck: [],
        });
  };

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
      decks: this.state.decks.map((deck) =>
        deck.id !== updatedDeck.id ? deck : updatedDeck
      ),
    });
  };

  handleUpdateCard = (updatedCard, cardId) => {
    this.setState({
      cards: this.state.cards.map((card) =>
        card.id !== cardId ? card : updatedCard
      ),
    });
  };

  renderMain() {
    return (
      <>
        [//Private routes will redirect to landing page if user is unauthorized]
        <PrivateRoute path="/newdeck" component={NewDeck} />
        <PrivateRoute path="/deck/:deckId" component={ViewCard} />
        <PrivateRoute exact path="/deck" component={ViewDecks} />
        <PublicRoute exact path="/account" component={RegistrationForm} />
        <PublicRoute exact path="/" component={LandingPage} />
      </>
    );
  }

  render() {
    const context = {
      decks: this.state.decks,
      cards: this.state.cards,
      getDecks: this.handleGetDecks,
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
            <Header />
          </header>
          <main className="AppMain">{this.renderMain()}</main>
        </div>
      </CardContext.Provider>
    );
  }
}

export default App;
