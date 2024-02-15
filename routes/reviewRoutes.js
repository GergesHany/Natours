const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// merge the url parameters from the parent router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReviews,
  );

// router.route('/:id').get(reviewController.getReview);
//  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
//  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
