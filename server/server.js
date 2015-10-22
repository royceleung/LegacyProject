// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser');  // bring in body parser for parsing requests
var router = require('./router.js');  // add link to our router file
// var session = require('express-session');    // enable sessions for user auth

var app = express();                 // define our app using express


// DATABASE
var mongoose = require('mongoose');          // enable Mongoose for db
mongoose.connect('mongodb://localhost/greenfield'); // connect to mongo db named greenfield


// configure app to use bodyParser() for request body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;        // set our port


// ROUTING
app.use(express.static('./../client/app'));  // serve static files

// all of our routes will be prefixed with /
app.use('/', router);
app.use('/userinfo', router);
// more routes for our API will happen here


// SERVER INIT
app.listen(port);
console.log('Unbalanced magic is happening on port ' + port);
