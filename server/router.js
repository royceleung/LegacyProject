// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var utils = require('./config/utils.js');  // bring in our utilities file
var passport = require('passport');  // auth via passport
var FacebookStrategy = require('passport-facebook').Strategy;  // FB auth via passport
var session = require('express-session');  // to enable user sessions
var User = require('./users/userModel.js');
var router = express.Router();           // create our Express router


// TODO: make these routes and utility methods work
    // all methods are in utils.js
router.post('/userlocation', utils.fetchMap);  // method to talk to mapFetch method

router.get('/map', utils.serveMap);  // method to serve map


// router.post('/userauth', utils.FBAuth);  // method to talk to FB

router.get('/userinfo', /* if valid auth */ utils.fetchUserInfo);  //method to serve user info if auth is valid

router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */);


// AUTH
// router.get('/auth/facebook',
//   passport.authenticate('facebook',{scope: ['user: email'] }),
//   function(req,res){
//     console.log('here',res);
//   });

router.get('/auth/facebook/callback',
   passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

router.get('/userauth', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
   res.redirect('/');
 });

passport.use( new FacebookStrategy({  // TODO: figure out how to use this!
  clientID: '1206604026022507',
  clientSecret: 'd3f622183e9aed53fad93ce7b70a9354',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',  // where does this go when it returns?
    enableProof: false
  },

  function(accessToken, refreshToken, profile, done, res) { 
   // provides tokens, the user's profile and done...a auth/facebook/callback?
   // User.findOrCreate({ facebookId: profile.id }, function(err, user) {
   //    // TODO: We will want to associate the Facebook account with
   //    // a user record in your database, and return that user instead.
   //    return done(err, user);
   //  });
  res.redirect('/');
   console.log("ACCESS:",accessToken,"REFRESH:", refreshToken,"PROFILE:", profile,"DONE:", done);
 }
 ));

router.get('/userinfo', utils.ensureAuthenticated, utils.fetchUserInfo);  //method to serve user info if auth is valid

router.get('/login', function(req, res) {   // do we need this??
  res.render('login', { user: req.user });
});

router.get('/logout', function(req, res) {  // do we need this??
  req.logout();
  res.redirect('/');
});



router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */);




module.exports = router;  // export router for other modules to use
