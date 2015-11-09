var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');  // add findOrCreate functionality to Mongoose

var siteSchema = new mongoose.Schema({
  site_place_id: {
    type: String,
    required: false
  },

  sitename: {
    type: String,
    required: true
  },

  siteReviews: {
    type: Array,
    required: false
  },

  checkins: {
    type: Number,
    required: false
  },

  events: {
    type: Array
  }

});

siteSchema.plugin(findOrCreate);

module.exports = mongoose.model('sites', siteSchema);
