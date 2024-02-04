const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const morgan = require('morgan'); // request logger middleware

const app = express();

// ------------------------------------------------------------------------------------------

const port = 3000;
app.use(morgan('dev')); // log the request method, the request url, the status code, the response time, and the size of the response body to the console
app.use(express.json());
/*
  app.use(express.json()); 
  This middleware is used to parse the incoming request body, which is in JSON format, into a JavaScript object before it is passed to the route handler. 

  without this middleware, the req.body object would be undefined, and we would not be able to access the data sent in the request body.
*/

// 1) MIDDLEWARES

// this middleware is used to log the request method and the request url to the console
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter); // mounting the router on a new route
app.use('/api/v1/users', userRouter); // mounting the router on a new route

module.exports = app;
