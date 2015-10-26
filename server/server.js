// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser');  // bring in body parser for parsing requests
var router = require('./router.js');  // add link to our router file
// var session = require('express-session');    // enable sessions for user auth
var Q = require('q');  // promises library
var session = require('express-session');  // to enable user sessions
var passport = require('passport');  // auth via passport
var FacebookStrategy = require('passport-facebook').Strategy;  // FB auth via passport

var User = require('./users/userModel.js');

var app = express();                 // define our app using express
var port = process.env.PORT || 8080;        // set our port


// // AUTH INIT
// app.use(session({ secret: 'this is the greenfield' }));
// app.use(passport.initialize());  // initialize passport
// app.use(passport.session());  // to support persistent login sessions


// DATABASE
// var mongoose = require('mongoose');          // enable Mongoose for db
// mongoose.connect('mongodb://localhost/greenfield'); // connect to mongo db named greenfield


// configure app to use bodyParser() for request body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTING
app.use(express.static(__dirname + '../../client/app'));  // serve static files

// all of our routes will be prefixed with /
app.use('/', router);
app.use('/login', router);
app.use('/logout', router);
app.use('/userinfo', router);
app.use('/siteinfo', router);
app.use('/map', router);
app.use('/userlocation', router);
app.use('/userauth', router);
app.use('/auth/facebook',router);
app.use('callback',router);

// AUTH
  //  serialization is necessary for persistent sessions
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});





// SERVER INIT
app.listen(port);
console.log('Unbalanced magic is happening on port ' + port);



//Test database by creating a new user
// var create = Q.nbind(User.create, User);
// newUser = {
//   'user_fb_id' : 12345,
//   'username' : 'alex'
// };
// create(newUser);