const express = require('express');
const router = express.Router(); // creating a new router
const tourController = require('../controllers/tourController');

// router.param('id', tourController.checkID); // this middleware is used to check if the id parameter is valid

router.route('/TourStats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
