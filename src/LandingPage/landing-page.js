import React, { Component } from "react";
import LoginForm from "./login-form";
import {Link} from "react-router-dom";

export default class LandingPage extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  }
  handleLoginSuccess = () => {
    const { location, history } = this.props
    const destination = (location.state || {}).from || '/deck'
    history.push(destination)
  }
  render() {
    return (
      <div>
        <section className="page" id="landing">
          <header role="banner">
            <h1>Quick Card</h1>
            <h2>The Streamlined Flash Card System.</h2>
          </header>
          <h3>Speed up your studying</h3>
          <p>
            Use your notes that you have already created and quickly generate a
            deck of cards.
          </p>
          <h3>Easy.</h3>
          <p>
            Simply copy and paste keywords or phrases with their definition.
            Instantly creates a deck of flash cards to study with.
          </p>
          [placeholder for screenshots of app in use]
          <h3>Pick up where you left off or  <Link to="/account">Register</Link></h3>
          <LoginForm
           onLoginSuccess={this.handleLoginSuccess}
          />
          <br />
        </section>
      </div>
    );
  }
}
