import React, { Component } from "react";
import LoginForm from "./login-form";
import { Link } from "react-router-dom";
import "./landing-page.css";
import CardContext from "../card-context";

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
    const destination = (location.state || {}).from || "/deck";
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
            Simply copy and paste keywords or phrases with their definition.
            Instantly creates a deck of flash cards to study with.
          </p>
          <h3>
            Log in and pick up where you left off or{" "}
            <Link to="/account">Register</Link>
          </h3>
          <LoginForm onLoginSuccess={this.handleLoginSuccess} />
          <br />
        </section>
      </div>
    );
  }
}
