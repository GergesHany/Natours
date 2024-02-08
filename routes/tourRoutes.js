const express = require('express');
const router = express.Router(); // creating a new router
const tourController = require('../controllers/tourController');

router.param('id', tourController.checkID); // this middleware is used to check if the id parameter is valid

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;
