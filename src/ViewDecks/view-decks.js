import React from "react";
import {Link} from 'react-router-dom';
import "./view-decks.css";
import {getCardsForDeck} from '../misc-functions';
import CardContext from '../card-context';
import config from "../config";
import TokenService from "../Services/token-service";

export default class ViewDecks extends React.Component {
  constructor(props) {
    super(props);

    //setting up state to facilitate editing

    this.state = {
      descriptionInputValue: "",
      nameInputValue: "",
      editDeckId: "",
      decks: [],
      cards: [],
    };
  }
 static contextType = CardContext;

 handleSave = (e) => {
  e.preventDefault();
  const id = this.state.editDeckId;
  const deck_name = this.state.nameInputValue;
  const description = this.state.descriptionInputValue;
  const deckId = parseFloat(this.state.editDeckId);
  const updatedDeck = { id, deck_name, description };
  fetch(`${config.API_ENDPOINT}/deck/${deckId}`, {
    method: "PATCH",
    body: JSON.stringify(updatedDeck),
    headers: {
      'authorization': `bearer ${TokenService.getAuthToken()}`,
      "content-type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) return res.json().then((error) => Promise.reject(error));
    })
    .then(() => {
      this.context.updateDeck(updatedDeck);
      this.setState({
        editDeckId: "",
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

handleClickDelete = () => {
  const deckId = parseFloat(this.state.editDeckId);
  fetch(`${config.API_ENDPOINT}/deck/${deckId}`, {
    method: "DELETE",
    headers: {
      authorization : `bearer ${TokenService.getAuthToken()}`,
      "content-type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((e) => Promise.reject(e));
      }
    })
    .then(() => {
      this.context.deleteDeck(deckId);
      let { cards = [] } = this.state;
      cards = getCardsForDeck(cards, deckId);
      cards.forEach((card) => {
         return this.props.deleteCard(card.id);
      });
    })
    .catch((error) => {
      console.error({ error });
    });
};
  renderStandard(deck) {
      const cards = this.context.cards;
      const deckId = deck.id.toString()
      const cardsInDeck = getCardsForDeck(cards, deckId);
     let countCards = cardsInDeck.length
      return (
        <>
          <span className="inline-edit">
            <Link to={`/deck/${deck.id}`}>
              <h4>{deck.deck_name}</h4>
            </Link>
            {deck.description}
          </span>
          <p>No. of cards: {countCards}</p>
          {/* <p>{deck.created}</p> */}
          <button
            onClick={(e) =>
              this.setState({
                editDeckId: deck.id,
                nameInputValue: deck.deck_name,
                descriptionInputValue: deck.description,
              })
            }
          >
            Edit
          </button>
        </>
      );
    }
  
    renderEdit(deck) {
      const initState = {
        descriptionInputValue: "",
        nameInputValue: "",
        editDeckId: "",
      };
      const cards = this.props.cards;
      const deckId = deck.id.toString()
      const cardsInDeck = getCardsForDeck(cards, deckId);
     let countCards = cardsInDeck.length

      return (
        <>
          <input
            value={this.state.nameInputValue}
            onChange={(e) => this.setState({ nameInputValue: e.target.value })}
            className="inline-edit_input"
            name="edit-name"
            required
          />
          <input
            defaultValue={this.state.descriptionInputValue}
            onChange={(e) =>
              this.setState({ descriptionInputValue: e.target.value })
            }
            className="inline-edit_input"
            name="edit description"
            required
          />
          <p>No. of cards: {countCards}</p>
          {/* <p>{deck.created}</p> */}
          {this.state.editDeckId === deck.id && (
            <div className="editModeButtons">
              <button onClick={(e) => this.setState({ ...initState })}>
                Cancel
              </button>
              <button onClick={(e) => this.handleSave(e)}>Save</button>
              <button onClick={(e) => this.handleClickDelete(e)}>Delete</button>
            </div>
          )}
        </>
      );
    }

  render() {

    let decks = this.context.decks;
    return (
      <section className="page" id="viewDecks">
        <>
          <h2>Your Decks</h2>
          <p>Here are all of your decks!</p>
          <h3>List of Decks</h3>
          <ul>
            {decks.map((deck) => (
              <li key={deck.id}>
              {deck.id === this.state.editDeckId ? (
                  <div>{this.renderEdit(deck)}</div>
                ) : (
                  <div>{this.renderStandard(deck)}</div>
                )}
              </li>
            ))}
          </ul>
          <Link to="/newdeck">
            <button className="add">Add new Deck</button>
          </Link>
        </>{" "}
      </section>
    );
  }
}
