const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please provide a valid email'],
  },
  phtoto: String,

  passwords: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A user password must have more or equal then 8 characters'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'A user must have a confirmPassword'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
