const router = require('express').Router();
let User = require('../models/user.model');

//endpoint that handles HTTP GET requests to /users
router.route('/').get((req, res) => {
  //get a list of all users from database
  User.find()
    .then(users => res.json(users)) //returns all users in json format
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP POST requests to /users
router.route('/add').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //create a new user using the username and password provided
  const newUser = new User({username, password});

  //save the new user to the database
  newUser.save()
    .then(() => res.json('User added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//export the router
module.exports = router;