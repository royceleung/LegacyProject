// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var utils = require('./config/utils.js');  // bring in our utilities file
var passport = require('passport');  // auth via passport
var passport = require('passport-facebook');  // FB auth via passport
var session = require('express-session');  // to enable user sessions

var router = express.Router();           // create our Express router


// TODO: make these routes and utility methods work
    // all methods are in utils.js
router.post('/userlocation', utils.fetchMap);  // method to talk to mapFetch method

router.get('/map', utils.serveMap);  // method to serve map


router.post('/userauth', utils.FBAuth);  // method to talk to FB

router.get('/userinfo', /* if valid auth */ utils.fetchUserInfo);  //method to serve user info if auth is valid

router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */);


// AUTH
router.get('/userauth', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // if auth is successful, redirect somewhere (home?)
  });
passport.use(new FacebookStrategy( {   // determines what profile data we request from FB
    // clientID, clientSecret and callbackURL
    profileFields: ['id', 'displayName', 'photos']
  },
  // insert verify callback here
));

router.get('/userinfo', utils.ensureAuthenticated, utils.fetchUserInfo);  //method to serve user info if auth is valid

// router.get('/login', function(req, res) {   // do we need this??
//   res.render('login', { user: req.user });
// };
// router.get('/logout', function(req, res) {  // do we need this??
//   req.logout();
//   res.redirect('/');
// });



router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */)




module.exports = router;  // export router for other modules to use
