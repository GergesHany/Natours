const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkID,
} = require('../controllers/userController');

router.param('id', checkID); // this middleware is used to check if the id parameter is valid

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
