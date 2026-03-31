const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'First name must be at least 3 characters']
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Last name must be at least 3 characters']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [5, 'Enter a valid email']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'Password must be at least 5 characters']
  }
});

const user = mongoose.model('user', userSchema);
module.exports = user;