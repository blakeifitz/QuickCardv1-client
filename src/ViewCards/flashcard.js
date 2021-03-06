import React from 'react';
import CardContext from '../card-context';
import config from '../config';
import TokenService from '../Services/token-service';
import './view-cards.css';
export default class Flashcard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      definitionInputValue: '',
      keywordInputValue: '',
      editCardId: '',
    };
  }
  static contextType = CardContext;

  handleDelete = (e) => {
    e.preventDefault();
    const CardId = parseFloat(this.state.editCardId);
    fetch(`${config.API_ENDPOINT}/card/${CardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
      })
      .then(() => {
        this.context.deleteCard(CardId);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  handleSave = (e) => {
    e.preventDefault();
    const keyword = this.state.keywordInputValue;
    const definition = this.state.definitionInputValue;
    const CardId = parseFloat(this.state.editCardId);
    let id = CardId;
    let deck = this.props.deck;
    const updatedCard = { id, keyword, definition, deck };
    fetch(`${config.API_ENDPOINT}/Card/${CardId}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedCard),
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.context.updateCard(updatedCard, CardId);
        this.setState({
          editCardId: '',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderStandard(card) {
    return !this.props.showAnswer ? (
      <>
        <div className="content-wrapper">
          <p>{card.cardNumber}</p>
          <span className="card_info">
            <h4>Word/Phrase:</h4>
            <p>{card.keyword ? card.keyword : ''}</p>
            <h4>Click to Flip</h4>
          </span>
        </div>
        <div className="button_group">
          <button
            onClick={(e) =>
              this.setState({
                editCardId: card.id,
                keywordInputValue: card.keyword,
                definitionInputValue: card.definition,
              })
            }
          >
            Edit
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="content-wrapper">
          <p>{card.cardNumber}</p>
          <span className="card_info">
            <h4>Definition:</h4>
            <p>{card.definition}</p>
            <h4>Click to Flip</h4>
          </span>
        </div>
        <div className="button_group">
          <button
            onClick={(e) =>
              this.setState({
                editCardId: card.id,
                keywordInputValue: card.keyword,
                definitionInputValue: card.definition,
              })
            }
          >
            Edit
          </button>
        </div>
      </>
    );
  }
  renderEdit(card) {
    const initState = {
      definitionInputValue: '',
      keywordInputValue: '',
      editCardId: '',
    };
    return (
      <>
        <div>
          <br />
          <h4>Word/Phrase:</h4>
          <p>
            {' '}
            <input
              value={this.state.keywordInputValue}
              onChange={(e) =>
                this.setState({ keywordInputValue: e.target.value })
              }
              className="inline-edit_input"
              name="edit-name"
              required
            />
          </p>
          <br />
        </div>
        <div>
          <h4>Definition:</h4>{' '}
          <textarea
            value={this.state.definitionInputValue}
            onChange={(e) =>
              this.setState({ definitionInputValue: e.target.value })
            }
            className="inline-edit_input"
            name="edit-name"
            required
          />
          <div className="button_group">
            <button onClick={(e) => this.setState({ ...initState })}>
              Cancel
            </button>
            <button onClick={(e) => this.handleSave(e)}>Save</button>
            <button onClick={(e) => this.handleDelete(e)}>Delete</button>
          </div>
        </div>
      </>
    );
  }

  render() {
    let card = this.props.card;
    return (
      <div className="flashcard-box">
        {card.id === this.state.editCardId ? (
          <div>{this.renderEdit(card)}</div>
        ) : (
          <div>{this.renderStandard(card)}</div>
        )}
      </div>
    );
  }
}
Flashcard.defaultProps = {
  card: [
    {
      keyword: '',
      definition: '',
      cardNumber: 1,
    },
  ],
};
