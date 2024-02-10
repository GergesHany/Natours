const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const morgan = require('morgan'); // request logger middleware

const app = express();

// ------------------------------------------------------------------------------------------

// this middleware is used to log the request method and the request url to the console in development mode only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
/*
  app.use(express.json()); 
  This middleware is used to parse the incoming request body, which is in JSON format, into a JavaScript object before it is passed to the route handler. 

  without this middleware, the req.body object would be undefined, and we would not be able to access the data sent in the request body.
*/

app.use(express.static(`${__dirname}/public`)); // serving static files
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter); // mounting the router on a new route
app.use('/api/v1/users', userRouter); // mounting the router on a new route

module.exports = app;
