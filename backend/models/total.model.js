const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//below is the schema for the totals model
const totalSchema = new Schema({
  userID: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const total = mongoose.model('total', totalSchema);

module.exports = total;