import React, { Component } from "react";
import TokenService from "../Services/token-service";
import AuthService from "../Services/auth-service";

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {},
  };
  state = { error: null };

  handleSubmitAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const userId = ev.target["login-userId"].value;
    const password = ev.target["login-password"].value;
    AuthService.postLogin({
      user_name: userId,
      password: password,
    })
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
        this.props.onLoginSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="login" onSubmit={this.handleSubmitAuth}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="user-id">
          <label htmlFor="login-userId">UserName:</label>
          <input
            placeholder="User Name"
            type="text"
            name="user-name"
            id="login-userId"
          />
        </div>
        <div className="password">
          <label htmlFor="login-password">Password:</label>
          <input
            placeholder="password"
            name="password"
            type="password"
            id="login-password"
          ></input>
        </div>
        <button type="submit">Login</button>
      </form>
    );
  }
}
