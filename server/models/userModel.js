var mongoose = require('mongoose');
var Q = require('q');
var findOrCreate = require('mongoose-findorcreate');  // add findOrCreate functionality to Mongoose

var userSchema = new mongoose.Schema({
  user_fb_id: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  photo: {
    type: String,
    required: false
  }

});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('users', userSchema);
