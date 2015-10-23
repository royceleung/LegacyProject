// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var router = require('../router.js');  // connect to our router


// MAP
exports.fetchMap = function(userLocation) {  // TODO: make this work
  // default location for user

  // http.request to Google for map

  // serveMap();
};

exports.serveMap = function(req, res) {  // TODO: make this work
  // res to client with map 
};


// AUTH & USER
exports.FBAuth = function() {  // TODO: make this work
  // talk to FB (http.request?) to confirm user auth

  // fetchUserInfo()
      // if user not found, postUserInfo()

  // res to client with auth validation
};

exports.fetchUserInfo = function() {
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
