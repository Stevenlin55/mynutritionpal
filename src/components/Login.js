import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/users/login", { username, password })
      .then((res) => console.log(res.data));
  }

  return (
    <div>
      <div id="login_register_bar">
        <div className="container d-flex justify-content-evenly">
          <div className="login w-25 mt-5">
            <h2>Sign In</h2>
            <form onSubmit={onSubmit}>
              <div className="form-floating">
                <input
                  className="form-control mb-3"
                  type="text"
                  id="username_login"
                  placeholder="Username"
                  onChange = {(e) => setUsername(e.target.value)}
                />
                <label for="username_login">Username</label>
              </div>
              <div className="form-floating">
                <input
                  className="form-control mb-3"
                  type="password"
                  id="password_login"
                  placeholder="password"
                  onChange = {(e) => setPassword(e.target.value)}
                />
                <label for="password_login">Password</label>
              </div>
              <button
                id="login_btn"
                type="submit"
                className="w-100 btn btn-lg btn-primary"
              >
                Login
              </button>
            </form>
          </div>

          <div className="register w-25 mt-5">
            <h2>Register</h2>
            <div className="form-floating">
              <input
                className="form-control mb-3"
                type="text"
                id="username_register"
                placeholder="Username"
              />
              <label for="username_register">Username</label>
            </div>
            <div className="form-floating">
              <input
                className="form-control mb-3"
                type="password"
                id="password_register"
                placeholder="password"
              />
              <label for="password_register">Password</label>
            </div>
            <button id="register_btn" className="w-100 btn btn-lg btn-primary">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
