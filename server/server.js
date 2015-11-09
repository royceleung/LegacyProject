// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser');  // bring in body parser for parsing requests
var router = require('./router.js');  // add link to our router file
var session = require('express-session');  // to enable user sessions
var passport = require('passport');  // auth via passport
var FacebookStrategy = require('passport-facebook').Strategy;  // FB auth via passport
var cookieParser = require('cookie-parser');  // parses cookies
var uriUtil = require('mongodb-uri');  // util for Mongo URIs
var Q = require('q');

// SCHEMA / MODELS
var User = require('./models/userModel.js');
var Site = require('./models/siteModel.js');

var app = express();     // define our app using express
var port = process.env.PORT || 8080;   // set our port

app.use(bodyParser.urlencoded({ extended: true })); // use bodyParser() for req body parsing
app.use(bodyParser.json());

// AUTH INIT
app.use(session({ secret: 'this is the greenfield' }));
app.use(passport.initialize());  // initialize passport
app.use(passport.session());  // to support persistent login sessions
app.use(cookieParser());

passport.serializeUser(function(user, done) { // serialization is necessary for persistent sessions
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// DATABASE
var mongoose = require('mongoose');     // enable Mongoose for db

// var mongodbUri = 'mongodb://ryan:gaaame@ds049104.mongolab.com:49104/gaaame_db';  // our DB URI
var mongodbUri = 'mongodb://royce1221:royce1221@ds049854.mongolab.com:49854/gamefinder';

var mongooseUri = uriUtil.formatMongoose(mongodbUri);  // formatting for Mongoose

var mongooseOptions = {  // MongoLabs-suggested socket options
  server: {
    socketOptions: {
      keepAlive: 1, connectTimeoutMS: 30000
    }
  }, 
  replset: {
    socketOptions: {
      keepAlive: 1, connectTimeoutMS : 30000
    }
  }
};

mongoose.connect(mongooseUri, mongooseOptions); // connect to our DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));


// ROUTING
app.use(express.static(__dirname + '../../client/app'));  // serve static files
app.use('/', router);

// app.use('/logout', router);
// app.use('/userinfo', router);
// app.use('/siteinfo', router);
// app.use('/checkin', router);
// app.use('/checkout', router);
// app.use('/auth/facebook',router);
// app.use('callback',router);
// app.use('/postReview', router);
// app.use('/eventinfo', router);




// SERVER INIT
app.listen(port);
console.log('Unbalanced magic is happening on port ' + port);


// DB TESTING - keep this! uncomment to test if db is connected
  // var userCreate = Q.nbind(User.create, User);
  // var newUser = {
  //  'user_fb_id' : 12345,
  //  'friends' : 'Larry',
  //  'username' : 'Ronald',
  //  'inviteFriend' : ['Jia', 'alex'],
  //  'messageCount' : 2
  // };
  // userCreate(newUser);

  // // var siteCreate = Q.nbind(Site.create, Site);
  // // var newSite = {
  // //  'site_place_id' : 54321,
  // //  'sitename' : 'JAMTOWN'
  // // };
  // // siteCreate(newSite);

  // var userFind = Q.nbind(User.find, User);
  // userFind(function(err, result) {
  //   if(err) {
  //     console.log('site lookup error: ', err);
  //   } else {
  //     console.log("results", result);
  //   }
  // })

  // var siteCreate = Q.nbind(Site.findOrCreate, Site);
  // var siteFind = Q.nbind(Site.findOne, Site);

  // var newSite = {
  //  'site_place_id' : "54321",
  //  'sitename' : 'JAMTOWN',
  //   events:{
  //     sport: 'Basketball',
  //     numPlayer: 12,
  //     time: '700pm',
  //     palce: 'Orcale Arena',
  //     comment: 'The best players on EARTH!!!!'
  //   }
  //  'averageRating' : 1
  // };
  // siteCreate(newSite).done(function(result) {
  //     console.log('created siteReviews are: ', result);
  // });

  // siteFind({
  //   'site_place_id': "54321"
  // }, 'sitename', function(err, result) {
  //     console.log("I am inside");

  //     console.log('retrieved information is: ', result);

  //     result.numberRating = 0;
  //     result.save();
  // })
