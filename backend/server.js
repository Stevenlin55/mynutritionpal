const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//configures so that we can have enviroment variables in dotenv file
require('dotenv').config();

//create express server on port 5000
const app = express();
const port = process.env.PORT || 5000;

//this is the middleware that allows us to parse JSON
app.use(cors());
app.use(express.json());

//this is the database URI for mongoDB. It will allow us to connect to our database. the .env file will have the URI
const uri = process.env.ATLAS_URI;

//connect to mongodb
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//these are the routes that will allow us to access the different endpoints
const foodsRouter = require('./routes/foods');
const usersRouter = require('./routes/users');
const totalsRouter = require('./routes/totals');

//if we go to /foods, we will go to the foods router
//if we go to /users, we will go to the users router
app.use('/foods', foodsRouter);
app.use('/users', usersRouter);
app.use('/totals', totalsRouter);

//this is the listener that will start the server on port 5000. Heroku will set the port for us
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

