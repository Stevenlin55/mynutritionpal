import React, { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../auth.js";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  function onSubmit(e) {
    e.preventDefault();

    //when the user submits the form, we want to log them in using the Auth class
    Auth.register(username, password);
  }

  return (
    <div>
        <div className="container d-flex justify-content-evenly">
          <div className="login w-50 mt-5">
            <h2>Register</h2>
            <form className="mt-3" onSubmit={onSubmit}>
              <div className="form-floating mt-2">
                <input
                  className="form-control mb-3"
                  type="text"
                  required
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
                  placeholder="password"
                  onChange = {(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password_login">Password</label>
              </div>
              <button
                type="submit"
                className="w-100 btn btn-lg btn-primary"
              >
                Register
              </button>
            </form>

            <div className="mt-3">
              <p className="text-sm sm:text-base">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>

     
        </div>
      </div>

  );
};

export default Register;
