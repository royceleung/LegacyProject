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
var cookieParser = require('cookie-parser');


router.get('/userinfo', /* if valid auth */ utils.fetchUserInfo);  //method to serve user info if auth is valid

router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {

    // Get User info from FB
    var fbUserInfo = {
      "fbId":res.req.user.id,
      "fbUserName":res.req.user.displayName,
      "fbPicture":res.req.user.photos[0].value,
    }

    // Set user info in cookies
    res.cookie('facebook', fbUserInfo);

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
  // Request special fiedls from facebook
  profileFields: ['id', 'displayName', 'photos'],
  clientID: '1664576320455716',
  clientSecret: '018421cdfca61a8d10f6beacf9dabab4',
    callbackURL: '/auth/facebook/callback',
    enableProof: false
  },

  function(accessToken, refreshToken, profile, done) {
   // provides tokens, the user's profile and done...a auth/facebook/callback?
   // User.findOrCreate({ facebookId: profile.id }, function(err, user) {
   //    // TODO: We will want to associate the Facebook account with
   //    // a user record in your database, and return that user instead.
   //    return done(err, user);
   //  });
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

// Define logout route after logout from facebook
router.get('/logout', function(req, res) {
  req.session.destroy(function (err) {
    res.clearCookie('facebook');
    res.redirect('/');
  });
});

router.get('/siteinfo' /* method to get site info for sites on currently map */);

router.post('/siteinfo' /* method to add/update site info */);

module.exports = router;  // export router for other modules to use
