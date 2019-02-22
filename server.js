const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const PORT = 4000;


const User = require("./models/User");
const usersRouter = require("./routes/api/users");

app.use(cors());


// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/transcribe', {
  useNewUrlParser: true }
  )
  .then(() => console.log("Connected Successfully with MongoDb transcribe"))
  .catch(err => console.log(err));

/*
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("Connected successfully with transcribe db");
});
*/


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", usersRouter);





app.listen(PORT, function() {
  console.log("Server is running on port: " + PORT);
});

