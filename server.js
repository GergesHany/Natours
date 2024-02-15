const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

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

const port = process.env.PORT || 3000; // if the environment variable PORT is not defined, the port will be set to 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// ------------------------- UNHANDLED REJECTION -------------------------
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  // close the server and then exit the process
  server.close(() => {
    process.exit(1);
  });
});
