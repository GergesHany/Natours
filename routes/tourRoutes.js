const express = require('express');
const router = express.Router(); // creating a new router

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

router.param('id', checkID); // this middleware is used to check if the id parameter is valid

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
