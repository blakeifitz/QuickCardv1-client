import React, { Component } from 'react';
import LoginForm from './login-form';
import { Link } from 'react-router-dom';
import './landing-page.css';
import CardContext from '../card-context';

export default class LandingPage extends Component {
  static contextType = CardContext;
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  };
  handleLoginSuccess = () => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || '/deck';
    history.push(destination);
  };
  render() {
    return (
      <div>
        <section className="page" id="landing">
          <h2>The Streamlined Flash Card System.</h2>
          <p>
            Use your notes that you have already created and quickly generate a
            deck of cards.
          </p>
          <h3>Easy.</h3>
          <p>
            Just copy and paste the notes you already wrote and get back a deck
            of Flashcards.
          </p>
          <p>
            <span className="test_login">
              To try out my application without creating an account use my test
              user, Testy McTest. username: <b>tester</b> password:{' '}
              <b>Password12345%</b>
            </span>
          </p>
          <h3>
            Log in and pick up where you left off or{' '}
            <Link to="/account">Register</Link>
          </h3>
          <LoginForm onLoginSuccess={this.handleLoginSuccess} />
          <br />
        </section>
      </div>
    );
  }
}
