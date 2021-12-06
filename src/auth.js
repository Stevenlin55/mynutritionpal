import axios from 'axios';
//This singleton class is used to authenticate the user

class Auth {
    constructor() {
        this.isAuthenticated = false;
    }

    login(username, password, callback) {
      //first we need to make a request to the server to see if we can login the user
        axios.post("http://localhost:5000/users/login", { username, password })
        .then((res) => {
          if (res.status === 200) {
            //if the user is authenticated, we store the token in local storage
            localStorage.setItem("token", res.data._id);
            this.isAuthenticated = true;
            //and we call the callback function that is called when user submits login form
            callback(this.isAuthenticated);
          } 
        })
        .catch((err) => {
          alert("Incorrect username or password");
        });

    }

    logout(callback) {
      //we remove the token from local storage to logout the user
        localStorage.removeItem("token");
        this.isAuthenticated = false;

      //callback function is called when user clicks logout button and it is handled by the navbar component
        callback();
    }

    register(username, password) {
      //first we need to make a request to the server to see if we can register the user
        axios.post("http://localhost:5000/users/register", { username, password })
        .then((res) => {
          if (res.status === 200) {
            alert("You have successfully registered! Please sign in");
            this.registerSuccess = true;
          }
        })
        .catch((err) => {
          alert("Username and/or password is already taken");
        });
    }

    isAuthenticated() {
        return this.isAuthenticated;
    }
}

export default new Auth();