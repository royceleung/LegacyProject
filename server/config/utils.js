// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var router = require('../router.js');  // connect to our router
var session = require('express-session');  // to enable user sessions
var User = require('../models/userModel.js');  // our user schema
var Site = require('../models/siteModel.js');  // our site schema
var Q = require('q');  // promises library


// AUTH & USER
exports.ensureAuthenticated = function(req, res, next) {  // make sure user auth is valid, use this for anything that needs to be protected
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
};

exports.fetchUserInfoFromFB = function(req, res) {  // Get User info from FB
  var fbUserInfo = {
    "fbId": res.req.user.id,
    "fbUserName": res.req.user.displayName,
    "fbPicture": res.req.user.photos[0].value,
  };

  res.cookie('facebook', fbUserInfo);  // Set user info in cookies

  exports.postUserInfo(fbUserInfo);

  res.redirect('/');
};

exports.getAllUsers = function(req, res) { // Get All Users from db
  console.log('HELLO');
  var userFind = Q.nbind(User.find, User);
  userFind(function(err, result) {
    if(err) {
      console.log('site lookup error: ', err);
    } else {
      res.send(result);
    }
  })
}

exports.addFriend = function(req, res) {  // update user friends info in db
  var userFind = Q.nbind(User.findOne, User);
  console.log('USER', req.body.friend);
  userFind({
    'username' : req.body.user.fbUserName
  }, 'friends', function(err, result) {
    if(err) {
      res.send('site lookup error: ', err);
    } else {
      result.friends.push(req.body.friend);
      result.save();
      res.send(result.friends);
    }
  })
}

exports.sendEvent = function(req, res) {
  console.log('called sendEvent with this body', req.body);
  var friendFind = Q.nbind(User.findOne, User);
  friendFind({
    'username' : req.body.friends[0]
  }, 'eventInvites', function(err, result) {
    if(err) {
      res.send('site lookup error: ', err);
    } else {
      var eventobj = req.body.event;
      eventobj.sender = req.body.user;
      result.eventInvites.push(eventobj);
      result.save();
      res.send(result.eventInvites);
    }
  })
}
 
exports.removeFriendRequest = function(req, res) {
  var userFind = Q.nbind(User.findOne, User);
  console.log("removing Friend in database");
  userFind({
    'username' : req.body.user.fbUserName
  }, 'inviteFriend', function(err, result) {
    if(err) {
      res.send('site lookup error: ', err);
    } else {
      var deleted = result.inviteFriend[result.inviteFriend.length -1];
      console.log('deleting this person', deleted);
      result.inviteFriend.pop();
      result.save();
      res.send(result.inviteFriend);
    }
  })
}
 
exports.friendRequest = function(req, res) {
  var userFind = Q.nbind(User.findOne, User);
  console.log('adding myself to this friendRequest', req.body.friend);
  userFind({
    'username' : req.body.friend
  }, 'inviteFriend', function(err, result) {
    if(err) {
      res.send('site lookup error: ', err);
    } else {
      console.log('RESULT', result);
      result.inviteFriend.push(req.body.user.fbUserName);
      // result.messageCount++;
      result.save();
      res.send({
        friendRequest : result.inviteFriend,
        // count : result.messageCount
      })
    }
  })
}

exports.postUserInfo = function(userInfo) {  // post user info to our db
  var userCreate = Q.nbind(User.findOrCreate, User);
  var newUser = {
    'user_fb_id': userInfo.fbId,
    'username': userInfo.fbUserName,
    'photo': userInfo.fbPicture
  };
  userCreate(newUser);
};


// SITES
exports.postSiteInfo = function(req, res) {  // interact with db to post site's info
  console.log("req.body", req.body);
  var siteCreate = Q.nbind(Site.findOrCreate, Site);
  var siteFind = Q.nbind(Site.findOne, Site);
  var newSite = {
    'site_place_id': req.body.place_id,
    'sitename': req.body.name,
    'numberRating': 0,
    'averageRating': 0,
    'siteReviews': [],
    'events': [],
    'checkins': 0    
  };

  console.log("Newsite.site_place_id ", req.body.place_id);
  console.log("Newsite.sitename", req.body.name);

  siteCreate(newSite);

  siteFind({
    'site_place_id': req.body.place_id
    }, 'site_place_id checkins numberRating averageRating siteReviews events', function(err, results) {
      if (err) {
        res.send('site lookup error: ', err);
      } else {
        res.send(results);
      }
    }
  );
};


//Display Events
exports.postEvents = function(req, res) {
  var siteFind = Q.nbind(Site.findOne, Site);
  var meetup = {
    'site_place_id': req.body.place_id,
    'sitename': req.body.name,
    'events': req.body.events
  };

  

  siteFind({
    'site_place_id': req.body.place_id
    }, 'site_place_id events', function(err, result) {
      if (err) {
        res.send('site lookup error: ', err);
      } else {
        result.events.push(req.body.events);
        result.save();
        res.send(result);
      }
    }
  );

};

exports.siteCheckin = function(req, res) {  //  update site checkin count and return new count
  var siteFind = Q.nbind(Site.findOne, Site);

  siteFind({
    'site_place_id': req.body.place_id
    }, 'checkins', function(err, result) {
      if (err) {
        res.send('site lookup error: ', err);
      } else {
        result.checkins++;
        result.save();
        res.send(result);
      }
    }
  );
};

exports.siteCheckout = function(req, res) {  //  update site checkin count and return new count
  var siteFind = Q.nbind(Site.findOne, Site);

  siteFind({
    'site_place_id': req.body.place_id
    }, 'checkins', function(err, result) {
      if (err) {
        res.send('site lookup error: ', err);
      } else {
        result.checkins--;
        result.save();
        res.send(result);
      }
    }
  );
};

exports.postReview = function(req, res) {
  console.log('my text is', req.body.text);
  var siteFind = Q.nbind(Site.findOne, Site);
  var user = req.body.user;
  var text = req.body.text;
  var rating = req.body.rating;

  siteFind({
    'site_place_id': req.body.place_id
  }, 'numberRating averageRating siteReviews', function(err, result) {
    if (err) {
      res.send('error in retrieve reviews: ', err);
    } else {
      console.log('siteReviews are: ', result);
      if(rating >= 1 && rating <= 5) {
        result.averageRating = (result.averageRating * result.numberRating + rating) / (result.numberRating + 1);
        result.numberRating++;
      }
      result.siteReviews.push({user: user, text: text, rating: rating});
      result.save();
      res.send(result);
    }
  })
};
