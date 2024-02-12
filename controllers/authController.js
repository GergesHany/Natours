// built-in node module that allows us to use callback-based functions as if they were promise-based
const { promisify } = require('util');

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  console.log(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.passwordConfirm,
    req.body.role,
  );

  const token = signToken(newUser._id);

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is ok, send token to client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

/*
  - Protect middleware use to protect routes from unauthorized access
  -  by checking if the user is logged in or not
  -  by checking the token in the header of the request 
  - and verifying it using the jwt.verify method from the jsonwebtoken package
*/

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const CurrentUser = await User.findById(decoded.id);
  if (!CurrentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401),
    );
  }

  // 4) Cheak if user chnaged password after the token was issued

  // iat -> is the time the token was issued
  if (CurrentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = CurrentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
