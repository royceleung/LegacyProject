// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var router = require('../router.js');  // connect to our router
var session = require('express-session');  // to enable user sessions


// AUTH & USER
exports.ensureAuthenticated = function(req, res, next) {  // make sure user auth is valid, use this for anything that needs to be protected
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
};

exports.fetchUserInfo = function() {
  // from FB example: res.render('account', { user: req.user });
  // TODO: interact with db to get user's info
};

exports.postUserInfo = function() {
  // TODO: interact with db to post user's info
};


// SITES
exports.fetchSiteInfo = function() {
  // TODO: interact with db to get site's info
};

exports.postSiteInfo = function() {
  // TODO: interact with db to post site's info
};
