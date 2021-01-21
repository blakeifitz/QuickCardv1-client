import React, { Component } from 'react';
import AuthService from '../Services/auth-service';
import './signup-form.css';

export default class RegistrationForm extends Component {
  handleSuccess = () => {
    this.props.history.push('/');
  };

  state = { error: null };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { full_name, nick_name, user_name, password } = ev.target;
    AuthService.postUser({
      user_name: user_name.value,
      password: password.value,
      full_name: full_name.value,
      nickname: nick_name.value,
    })
      .then((user) => {
        full_name.value = '';
        nick_name.value = '';
        user_name.value = '';
        password.value = '';
        this.handleSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="form_wrapper" onSubmit={this.handleSubmit}>
        <h2>Register your account</h2>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="full_name">
          <label htmlFor="RegistrationForm__full_name">Full name:</label>
          <input
            name="full_name"
            type="text"
            required
            id="RegistrationForm__full_name"
          ></input>
        </div>
        <div className="user_name">
          <label htmlFor="RegistrationForm__user_name">UserName:</label>
          <input
            autoComplete="username"
            name="user_name"
            type="text"
            required
            id="RegistrationForm__user_name"
          ></input>
        </div>
        <div className="password">
          <label htmlFor="RegistrationForm__password">Password:</label>
          <input
            autoComplete="current-password"
            name="password"
            type="password"
            required
            id="RegistrationForm__password"
          ></input>
        </div>
        <div className="nick_name">
          <label htmlFor="RegistrationForm__nick_name">Nickname:</label>
          <input
            name="nick_name"
            type="text"
            required
            id="RegistrationForm__nick_name"
          ></input>
        </div>
        <button type="submit">Register</button>
      </form>
    );
  }
}
