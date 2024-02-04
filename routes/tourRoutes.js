const express = require('express');
const router = express.Router(); // creating a new router

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
} = require('../controllers/tourController');

router.param('id', checkID); // this middleware is used to check if the id parameter is valid

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
