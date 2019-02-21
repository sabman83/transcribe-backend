const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/transcribe', {
  useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("Connected successfully with transcribe db");
});

app.use('/transcribe', router);



let Transcribe = require('./model/transcribe');

router.route('/:userId').get(function(req, res) {
  Transcribe.findById(req.params.id, function(err, list) {
    if(err) {
      console.log(err);
    } else {
      res.json(list);
    }
  });
});

router.route('/add').post(function(req, res) {
  });



app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

