const router = require('express').Router();
let Food = require('../models/food.model');

//endpoint that handles HTTP GET requests to /foods
router.route('/').get((req, res) => {
  //get a list of all foods from database
  Food.find()
    .then(foods => res.json(foods)) //returns all foods in JSON format
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP POST requests to /foods
router.route('/add').post((req, res) => {
  const userID = req.body.userID;
  const name = req.body.name;
  const calories = Number(req.body.calories);
  const protein = Number(req.body.protein);
  const date = Date.parse(req.body.date);

  //create a new food object with provided info 
  const newFood = new Food({
    userID,
    name,
    calories,
    protein,
    date,
  });

  //save the new food object to the database
  newFood.save()
  .then(() => res.json('Food added'))
  .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP GET requests to /foods/id 
router.route('/:id').get((req, res) => {
  //find the food with the provided id
  Food.findById(req.params.id)
    .then(food => res.json(food))
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP DELETE requests to /foods/id 
router.route('/:id').delete((req, res) => {
  //delete the food with the provided id
  Food.findByIdAndDelete(req.params.id)
    .then(() => res.json('Food deleted'))
    .catch(err => res.status(400).json('Error: ' + err));
});


//endpoint that handles HTTP UPDATE requests to /foods/id
router.route('/update/:id').post((req, res) => {
  //find the food with the provided id and then update it with the provided info 
  //that was sent in the request body in JSON format
  Food.findById(req.params.id)
    .then(food => {
      food.name = req.body.name;
      food.calories = Number(req.body.calories);
      food.protein = Number(req.body.protein);
      food.date = Date.parse(req.body.date);
      food.save()
        .then(() => res.json('Food updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


//endpoint that handles HTTP GET requests to /foods/userID
router.route('/user/:userID').get((req, res) => {
  //find all foods with the provided userID
  Food.find({userID: req.params.userID})
    .then(foods => res.json(foods))
    .catch(err => res.status(400).json('Error: ' + err));
});


//export router
module.exports = router;
