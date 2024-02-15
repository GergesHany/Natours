const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');

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

// ------------------------- IMPORT DATA INTO DATABASE -------------------------
const importData = async () => {
  try {
    await Tour.create(tours);
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
