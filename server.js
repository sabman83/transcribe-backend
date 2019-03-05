const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const PORT = 4000;


const User = require("./models/User");
const usersRouter = require("./routes/api/users");

const Audio = require("./models/Audio");
const audioRouter = require("./routes/api/audio");


app.use(cors());
app.use(fileUpload())
app.use('/', express.static(__dirname))

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
app.use("/api/audio", audioRouter);




app.listen(PORT, function() {
  console.log("Server is running on port: " + PORT);
});

