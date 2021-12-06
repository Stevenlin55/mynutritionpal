import React, { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../auth.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  function onSubmit(e) {
    e.preventDefault();

    //when the user submits the form, we want to log them in using the Auth class
    Auth.login(username, password, (isAuthenticated) => {
      //after attempting to log them in, we want to check if they are authenticated
      if (isAuthenticated) {
        //if they are authenticated, we want to redirect them to the home page
        window.location.href = "/";
      }
    });
  }

  return (
    <div>
      <div id="login_register_bar">
        <div className="container d-flex justify-content-evenly">
          <div className="login w-50 mt-5">
            <h2>Login</h2>
            <form className="mt-3" onSubmit={onSubmit}>
              <div className="form-floating mt-2">
                <input
                  className="form-control mb-3"
                  type="text"
                  required
                  id="username_login"
                  placeholder="Username"
                  onChange = {(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username_login">Username</label>
              </div>
              <div className="form-floating">
                <input
                  className="form-control mb-3"
                  type="password"
                  required
                  id="password_login"
                  placeholder="password"
                  onChange = {(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password_login">Password</label>
              </div>
              <button
                id="login_btn"
                type="submit"
                className="w-100 btn btn-lg btn-primary"
              >
                Login
              </button>
            </form>

            <div className="mt-3">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>

     
        </div>
      </div>
    </div>
  );
};

export default Login;
