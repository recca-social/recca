import React, { Component } from "react";
import axios from "axios";
import "./style.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      redirectTo: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit");

    axios
      .post("/login/local", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log("login response: ");
        console.log(response);
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: response.data.username
          });
          // update the state to redirect to home
          this.setState({
            redirectTo: "/home"
          });
        }
      })
      .catch(error => {
        console.log("login error: ");
        console.log(error);
      });
  }

  render() {
    return (
      <div className="login-form-container" id="login-form">
        <div className="login-form-content">
          <div className="login-form-header">
            <div className="logo">
              <img
                src="./images/reccoon-lg.png"
                alt="recco"
                style={{ height: "100px" }}
              />
            </div>
            <h3>Recco</h3>
          </div>
          <form method="post" action="/login/local" className="login-form">
            <div className="input-container">
              <i className="fas fa-user" />
              <input
                type="text"
                className="input"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
              />
            </div>
            <div className="input-container">
              <i className="fas fa-lock" />
              <input
                type="password"
                id="login-password"
                className="input"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <input
              type="submit"
              name="login"
              value="Log In"
              className="button"
              onClick={this.handleSubmit}
            />
            <a href="/signup" className="register">
              Create Account
            </a>
          </form>
          <div className="separator">
            <span className="separator-text">OR</span>
          </div>
          <div className="socmed-login">
            <a href="/login/facebook" className="socmed-btn facebook-btn">
              <i className="fab fa-facebook-square" />
              <span>Login with Facebook</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
