const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet'); // security HTTP headers middleware
const morgan = require('morgan'); // request logger middleware
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// setting the view engine to pug so that we don't have to specify the file extension when rendering the templates
app.set('view engine', 'pug');

// setting the path to the views folder
app.set('views', path.join(__dirname, 'views'));

// ------------------------------------------------------------------------------------------

// 1) GLOBAL MIDDLEWARES

app.use(express.static(path.join(__dirname, 'public'))); // serving static files

app.use(helmet()); // set security HTTP headers

// this middleware is used to log the request method and the request url to the console in development mode only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// this middleware is used to limit the number of requests that are sent to the server from the same IP address
const limiter = rateLimit({
  max: 50, // the maximum number of requests that are allowed to be sent in the time window
  windowMs: 60 * 60 * 1000, // the time window in milliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// this middleware is used to parse the incoming request body,
// which is in URL-encoded format, into a JavaScript object before it is passed to the route handler.

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// this middleware is used to parse the cookies from the request
app.use(cookieParser());

/*
  app.use(express.json()); 
  This middleware is used to parse the incoming request body, which is in JSON format, into a JavaScript object before it is passed to the route handler. 

  without this middleware, the req.body object would be undefined, and we would not be able to access the data sent in the request body.
*/

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// hpp -> HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter); // mounting the router on a new route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// 4) ERROR HANDLING MIDDLEWARE

// this middleware is used to handle all the requests that are not handled by the routers
app.all('*', (req, res, next) => {
  // if the next function is called with an argument, it will be treated as an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// this middleware is used to handle all the errors that are passed to the next function
app.use(globalErrorHandler);

module.exports = app;
