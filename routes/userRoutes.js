const fs = require('fs');
const express = require('express');
const router = express.Router();

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getAllUsers = function (req, res) {
  res.status(200).json({
    status: 'success',
    result: users.length,
    requestedAt: req.requestTime,
    data: {
      users,
    },
  });
};

const createUser = function (req, res) {
  const newId = users[users.length - 1]._id + 1;
  const newUser = Object.assign({ _id: newId }, req.body);
  users.push(newUser);

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    }
  );
};

const getUser = function (req, res) {
  let id = String(req.params.id);
  const user = users.find((el) => el._id === id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

const updateUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
