const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Audio = new Schema({
  name: {
    type: String
  },
  userId: {
    type: String
  },
  text: {
    type: String
  },
  status: {
    type: String
  }
});

module.exports = mongoose.model('Audio', Audio);
