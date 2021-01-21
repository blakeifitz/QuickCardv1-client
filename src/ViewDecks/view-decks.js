import React from 'react';
import { Link } from 'react-router-dom';
import './view-decks.css';
import RenderDecks from './render-decks';
import CardContext from '../card-context';

export default class ViewDecks extends React.Component {
  static contextType = CardContext;
  componentDidMount() {
    this.context.getDecks();
  }
  render() {
    return (
      <section className="page" id="viewDecks">
        <div className="container">
          <h2>Your Decks</h2>
          <p>Here are all of your decks!</p>
          <RenderDecks />
          <Link to="/newdeck">
            <button className="add">Add new Deck</button>
          </Link>
        </div>{' '}
      </section>
    );
  }
}
