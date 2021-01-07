import React from "react";
import CardContext from "../card-context";
import { PageParse } from "./page-parse";
import config from "../config";
import TokenService from "../Services/token-service";
import "./new-deck.css";

export default class NewDeck extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: 0,
    };
  }
  static contextType = CardContext;

  handleSubmit = (e) => {
    e.preventDefault();
    let newNotes = e.target["notes"].value;
    let deckName = e.target["deckName"].value;
    let description = e.target["deckDescription"].value;
    let splitSymbol = e.target["symbol-select"].value;

    const deck = {
      deck_name: deckName,
      description: description,
      created: new Date(),
    };

    let cards = PageParse(newNotes, 0, splitSymbol);

    if (!cards) {
      return this.setState({ errorMessage: 1 });
    } else {
      fetch(`${config.API_ENDPOINT}/deck`, {
        method: "POST",
        headers: {
          authorization: `bearer ${TokenService.getAuthToken()}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(deck),
      })
        //If resolve is not okay return the json error and reject promis
        .then((deckRes) => {
          if (!deckRes.ok) return deckRes.json().then((e) => Promise.reject(e));
          return deckRes.json();
        })

        //cards get deckID from response from api after adding the deck
        .then((res) => {
          cards = PageParse(newNotes, res.id, splitSymbol);
          deck.id = res.id;
          this.context.commitDeck(deck);
          cards.forEach((card) =>
            fetch(`${config.API_ENDPOINT}/card`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `bearer ${TokenService.getAuthToken()}`,
              },
              body: JSON.stringify(card),

              //check card resolve
            })
              .then((cardRes) => {
                if (!cardRes.ok)
                  return cardRes.json().then((e) => Promise.reject(e));
                return cardRes.json();
              })
              .then((res) => {
                console.log(res);
                this.context.commitCards(res);
              })
          );

          //after the data is given to server commit to state
          this.props.history.push("/deck");
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };
  render() {
    return (
      <div>
        {this.state.errorMessage !== 0 && <p>Please add valid notes to deck</p>}
        <h2>Add Deck</h2>
        <form onSubmit={this.handleSubmit}>
          <br />
          <label htmlFor="deckName">Enter Deck Name</label>
          <br />
          <input placeholder="Name of Deck" id="deckName" />
          <br />
          <label htmlFor="notes">Insert notes</label>
          <br />
          <textarea
            placeholder='Example:"NPX: Allows for running a one time command as if it was global."(Separate cards by line return)'
            id="notes"
          ></textarea>
          <br />
          <label htmlFor="deckDescription">Describe Deck</label>
          <br />
          <input
            placeholder="What is the deck for?"
            id="deckDescription"
          ></input>
          <label htmlFor="note-folder-select">Split Symbol</label>
          <select id="symbol-select">
            <option value=":">:</option>
            <option value="?">?</option>
            <option value="-">-</option>
            <option value="/">/</option>
          </select>
          <br />
          <br />
          <button>Submit</button>
        </form>
        <button onClick={() => this.props.history.push("/deck")}>Cancel</button>
      </div>
    );
  }
}
