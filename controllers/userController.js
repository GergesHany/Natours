const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`User id is: ${val}`);
  if (req.params.id * 1 > users.length || !users.find((el) => el._id === val)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.getAllUsers = function (req, res) {
  res.status(200).json({
    status: 'success',
    result: users.length,
    requestedAt: req.requestTime,
    data: {
      users,
    },
  });
};

exports.createUser = function (req, res) {
  const newId = users[users.length - 1]._id + 1;
  const newUser = Object.assign({ _id: newId }, req.body);
  users.push(newUser);

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
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

exports.getUser = function (req, res) {
  let id = String(req.params.id);
  const user = users.find((el) => el._id === id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.updateUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
