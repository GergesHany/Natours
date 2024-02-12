const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
// router.param('id', userController.checkID); // this middleware is used to check if the id parameter is valid

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
