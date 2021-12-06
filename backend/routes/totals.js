const router = require('express').Router();
let Total = require('../models/total.model');

//endpoint that handles HTTP GET requests to /totals
router.route('/').get((req, res) => {
  //get a list of all Totals from database
  Total.find()
    .then(totals => res.json(totals)) //returns all Totals in JSON format
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP POST requests to /totals
router.route('/add').post((req, res) => {
  const userID = req.body.userID;
  const calories = Number(req.body.calories);
  const protein = Number(req.body.protein);
  const date = Date.parse(req.body.date);

  //create a new Total object with provided info 
  const newTotal = new Total({
    userID,
    calories,
    protein,
    date,
  });

  //save the new Total object to the database
  newTotal.save()
  .then(() => res.json('Total added'))
  .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP GET requests to /totals/id 
router.route('/:id').get((req, res) => {
  //find the Total with the provided id
  Total.findById(req.params.id)
    .then(total => res.json(total))
    .catch(err => res.status(400).json('Error: ' + err));
});

//endpoint that handles HTTP get requests to /totals/userID. It will allow us to query all Totals for a specific user
router.route('/user/:userID').get((req, res) => {
  //find the Total with the provided userID
  Total.find({userID: req.params.userID})
    .then(totals => res.json(totals))
    .catch(err => res.status(400).json('Error: ' + err));
});


//endpoint that handles HTTP UPDATE requests to /totals/id
router.route('/update/:id').post((req, res) => {
  //find the Total with the provided id and then update it with the provided info 
  //that was sent in the request body in JSON format
  Total.findById(req.params.id)
    .then(Total => {
      Total.calories = Number(req.body.calories);
      Total.protein = Number(req.body.protein);
      Total.save()
        .then(() => res.json('Total updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//export router
module.exports = router;
