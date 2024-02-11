const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // JWT_EXPIRES_IN is set to 90 days in the .env file
  // JWT_SECRET is set to 'my-ultra-secure-and-ultra-long-secret' in the .env file

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
