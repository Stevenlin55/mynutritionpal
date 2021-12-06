const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//below is the schema for the food model
const foodSchema = new Schema({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const food = mongoose.model('food', foodSchema);

module.exports = food;