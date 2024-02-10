module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500; // if the error does not have a status code, it will be set to 500
  err.status = err.status || 'error'; // if the error does not have a status, it will be set to 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
};
