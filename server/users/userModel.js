var mongoose = require('mongoose');
var Q = require('q');

var userSchema = new mongoose.Schema({
  user_fb_id : {
    type: String,
    required: false
  },

  username : {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('users', userSchema);