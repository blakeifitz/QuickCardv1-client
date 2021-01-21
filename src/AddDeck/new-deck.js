import React from 'react';
import CardContext from '../card-context';
import { PageParse } from './page-parse';
import config from '../config';
import TokenService from '../Services/token-service';
import './new-deck.css';
import notesSS from './notes-ss.png';

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
    let newNotes = e.target['notes'].value;
    let deckName = e.target['deckName'].value;
    let description = e.target['deckDescription'].value;
    let splitSymbol = e.target['symbol-select'].value;

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
        method: 'POST',
        headers: {
          authorization: `bearer ${TokenService.getAuthToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(deck),
      })
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
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                authorization: `bearer ${TokenService.getAuthToken()}`,
              },
              body: JSON.stringify(card),
            })
              .then((cardRes) => {
                if (!cardRes.ok)
                  return cardRes.json().then((e) => Promise.reject(e));
                return cardRes.json();
              })
              .then((res) => {
                this.context.commitCards(res);
              })
          );

          this.props.history.push('/deck');
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };
  render() {
    return (
      <section className="page">
        <h2>Add Deck</h2>

        <p>
          Copy and paste your keyword/definition pairs separated by a line
          return. Keyword/definition pairs must be on the same line.
        </p>
        <figure>
          <img
            src={notesSS}
            alt="screenshot of notes"
            className="inline_ss"
          ></img>
          <figcaption>Example of note structure</figcaption>
        </figure>
        {this.state.errorMessage !== 0 && (
          <p className="red">
            No cards were able to be created. Please check the formatting of
            your notes.
          </p>
        )}
        <form className="form_wrapper" onSubmit={this.handleSubmit}>
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

          <label htmlFor="symbol-select">Split Symbol</label>
          <select id="symbol-select">
            <option value=":">:</option>
            <option value="?">?</option>
            <option value="-">-</option>
            <option value="/">/</option>
          </select>
          <br />
          <br />
          <div className="button_group">
            <button>Submit</button>
            <button onClick={() => this.props.history.push('/deck')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }
}
