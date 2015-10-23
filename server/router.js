// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var utils = require('./config/utils.js');  // bring in our utilities file

var router = express.Router();           // create our Express router


// TODO: make these routes and utility methods work
    // all methods are in utils.js
router.post('/userlocation', fetchMap);  // method to talk to mapFetch method

router.get('/map', serveMap);  // method to serve map

router.post('/userauth', FBAuth);  // method to talk to FB

router.get('/userinfo', /* if valid auth */ fetchUserInfo);  //method to serve user info if auth is valid

router.get('/siteinfo', /* method to get site info for sites on currently map */);

router.post('/siteinfo', /* method to add/update site info */)



module.exports = router;  // export router for other modules to use
