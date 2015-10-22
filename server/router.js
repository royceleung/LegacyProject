var express    = require('express');        // call express
var bodyParser = require('body-parser');
var router = express.Router();              // get an instance of the express Router

router.get('/userinfo', function(req, res) {
  console.log("get method");
  res.json({ message: 'Hello Greenfield World' });   
});

router.post('/userinfo', function(req, res) {
  console.log("post method");
  console.log(req.body);
  res.json({ message: 'Hello Greenfield World Post' });   
});

module.exports = router;