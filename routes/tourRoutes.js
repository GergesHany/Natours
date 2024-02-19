const express = require('express');
const router = express.Router(); // creating a new router
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// router.param('id', tourController.checkID); // this middleware is used to check if the id parameter is valid

router.route('/TourStats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan,
  );

// this route is used to get the tours within a certain distance from a certain point
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getAllTours,
  )
  .post(tourController.createTour);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(tourController.deleteTour);

// Nested routes with Express
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
