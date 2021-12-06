const router = require('express').Router();
let User = require('../models/user.model');

//endpoint that handles HTTP GET requests to /users
router.route('/').get((req, res) => {
  //get a list of all users from database
  User.find()
    .then(users => res.json(users)) //returns all users in json format
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP POST requests to /users (create a new user)
router.route('/register').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  register(res, username, password)
});

//endpoint that handles HTTP POST requests to /users (user login)
router.route('/login').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  login(res, username, password);
});


//function that handles user registration
async function register(res, username, password) {
  try {
    //check if the username already exists in the database
    const usernameExists = await User.findOne({username: username});
    if (usernameExists) {
      res.status(403).json('Username already exists');
    } else {
      //if the username does not exist, check if the password already exists
      const passwordExists = await User.findOne({password: password});
      if (passwordExists) {
        res.status(403).json('Password already exists');
      } else {
        //if the username and password do not exist, create a new user
        const newUser = new User({username: username, password: password});
        newUser.save()
          .then(() => res.json('User added!'))
          .catch(err => res.status(400).json('Error: ' + err));
    }
  }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
}


//function that handles user login
async function login(res, username, password) {
  try {
    //find the user with the username provided
    const user = await User.findOne({username: username});
    //if the user does not exist in the database, return an error
    if (user === null) { 
      res.status(403).json('Incorrect username or password');
    } else { //if the user exists, check if the password matches
      if (user.password === password) {
        //if the password matches, return user's json data
        res.json(user);
      } else { //if the password does not match, return an error
        res.status(403).json('Incorrect username or password');
      }
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
}



//export the router
module.exports = router;