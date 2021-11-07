const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//below is the schema for the user model
const userSchema = new Schema({
  //user has username
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  //user has password
  password: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;