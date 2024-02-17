const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

// ------------------------- DATABASE CONNECTION -------------------------

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

// ------------------------- READ JSON FILE -------------------------
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// ------------------------- IMPORT DATA INTO DATABASE -------------------------
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); // this will disable the validation for the passwordConfirm field
    await Review.create(reviews);
    console.log('Data successfully loaded!');
    process.exit(); // this will close the application
  } catch (err) {
    console.log(err);
  }
};

// ------------------------- DELETE ALL DATA FROM DATABASE -------------------------
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    process.exit(); // this will close the application
  } catch (err) {
    console.log(err);
  }
};

// console.log(process.argv); // this will print the command line arguments

// ------------------------- COMMAND LINE ARGUMENTS -------------------------
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
