// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var router = express.Router();           // create our Express router

router.get('/userinfo', function(req, res) {
  console.log("get method");
  res.json({ message: 'Hello Greenfield World' });   
});

router.post('/userinfo', function(req, res) {
  console.log("post method");
  console.log(req.body);
  res.json({ message: 'Hello Greenfield World Post' });   
});

module.exports = router;  // export router for other modules to use
