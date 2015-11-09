// Unbalanced ()) Greenfield Project
// =============================================================================

'use strict';

angular.module('myApp.home', ['ngRoute', 'ngCookies'])



.controller('homeController', ['$scope', '$log', '$http', '$cookies', function($scope, $log, $http, $cookies) {

// $SCOPE VARIABLES
  $scope.map;
  $scope.userPosition;
  $scope.sitesResults;
  $scope.currentKeyword;
  $scope.clickedPosition;
  $scope.currentRankByFlag;
  $scope.checkins;
  $scope.allUsers = [];
  $scope.user;
  $scope.friendAdded = false;
  $scope.theUser;
  $scope.notifications = false;
  $scope.notificationCounter;

  $scope.sports = {
    'Basketball': 'Basketball Court',
    'Soccer': 'Soccer Field',
    'Tennis': 'Tennis Court',
    'Baseball': 'Baseball Field',
    'Softball': 'Softball Field',
    'Gym': 'Gym',
    'Rock-Climbing': 'Climbing Gym',
    'Golf': 'Golf Course',
    'Racquetball': 'Racquetball Court',
    'Squash': 'Squash Court'
  };

// OTHER VARIABLES
  var defaultLocation = {  // this is SF
    lat: 37.7833,
    lng: -122.4167
  };
  var userMarkerImage = '../assets/images/centerflag.png';
  var blueDotImage = '../assets/images/bluedot.png';
  var sportIcons = {
    'Basketball Court': '../assets/images/basketball.png',
    'Soccer Field': '../assets/images/soccer.png',
    'Tennis Court': '../assets/images/tennis.png',
    'Baseball Field': '../assets/images/baseball.png',
    'Softball Field': '../assets/images/softball.png',
    'Gym': '../assets/images/gym.png',
    'Climbing Gym': '../assets/images/climbing.png',
    'Golf Course': '../assets/images/golf.png',
    'Racquetball Court': '../assets/images/racketball.png',
    'Squash Court': '../assets/images/squash.png'
  };
  var markers = [];
  var infowindow;
  var geocoder;
  var userMarker;
  var searchLocation;

  $scope.notificationChecker = function() {
    $scope.notificationCounter = $scope.theUser.inviteFriend.length + $scope.theUser.eventInvites.length;
    console.log($scope.notificationCounter);
    if($scope.notificationCounter > 0) {
        $scope.notifications = true;
    } else {
      $scope.notifications = false;
    }
  }


$scope.getAllUsers = function() {
 fbCookie = false;
  var fbCookie = $cookies.get('facebook');  // get cookie from FB
 
  if (fbCookie) {
    fbCookie = fbCookie.split('j:');
    fbCookie = JSON.parse(fbCookie[1]);  // parse the cookie
 
    var user = {
      'fbUserId' : fbCookie.fbId,
      'fbUserName' : fbCookie.fbUserName,
      'fbPicture' : fbCookie.fbPicture
    }
    $scope.user = user;
    $scope.fbCookie = true;
 
    $http.get('/getAllUsers')
    .then(function success(result) {
      $scope.allUsers = result.data;
      console.log('allUsers', $scope.allUsers);
      for(var i = 0; i < $scope.allUsers.length; i++) {   // set the friend status of all users to false;
        $scope.allUsers[i].friended = false;
        $scope.allUsers[i].pending = false;
        if($scope.allUsers[i].username === $scope.user.fbUserName) {  //set theUser as the current User;
          $scope.theUser = $scope.allUsers[i];
        }
      }
      for(var i = 0; i < $scope.theUser.friends.length; i++) {  //find all friends for theUser
        for(var j = 0; j < $scope.allUsers.length; j++) {       //set the friend status of found friends to true
          if($scope.theUser.friends[i] === $scope.allUsers[j].username) {
            console.log('Found a friend');
            $scope.allUsers[j].friended = true;
          }
        }
      }
      console.log('Friend Requests: ', $scope.theUser.inviteFriend.length);
      console.log('Event Invites:', $scope.theUser.eventInvites);
      $scope.notificationChecker();
    })
  }
 }

$scope.addFriend = function(user) {
  console.log('Adding as friend: ', user);
  if($scope.theUser.username === user) {
      $scope.theUser.inviteFriend.pop();
      $scope.theUser.friends.push(user);
  }
  $scope.cancelFriendRequest();
  $http.post('/addFriend', { user: $scope.user, friend: user})    //add a Friend to user;
  .then(function success(result) {
    var friend = result.data[result.data.length-1];
    console.log('added friend to database: ', friend);
    for(var i = 0; i < $scope.allUsers.length; i++) {
      if($scope.allUsers[i].username === friend) {    //set the friend status to true;
        $scope.allUsers[i].friended = true;
        $scope.allUsers[i].pending = false;
      }
    }
    $scope.notificationChecker();
  })
}
 
  $scope.sendEvents = function(event) {
    console.log('My friends', $scope.theUser.friends);
    $http.post('sendEvent', { user: $scope.user.fbUserName, friends: $scope.theUser.friends, event: event})
    .then(function successCallback(response) {
      console.log('Successfully sent friends this event', response);
      console.log('Before userInvite: ', $scope.theUser.eventInvites);
      if($scope.theUser.username === response.data[response.data.length-1].sender) {
        console.log('Am i in here');
      $scope.theUser.eventInvites = response.data;
    }
      $scope.notificationChecker();
    })
  }
 
  $scope.cancelFriendRequest = function(user) {
    console.log('removing Friend Request');
    if(user) {
      for(var j = 0; j < $scope.allUsers.length; j++) {       
        if($scope.allUsers[j].username === user) {
          $scope.allUsers[j].pending = false;
        }
      }
    }
    if($scope.theUser.username === user) {
      $scope.theUser.inviteFriend.pop();
    }
    $http.post('/removeFriendRequest', {user: $scope.user})
    .then(function success(result) {
      console.log('removed this person from friends list', result.data);
    })
  }
 
$scope.friendRequest = function(user) {
  console.log('requesting as friend: ', user);
  for(var j = 0; j < $scope.allUsers.length; j++) {       //set the friend status of found friends to true
      if($scope.allUsers[j].username === user) {
        $scope.allUsers[j].pending = true;
      }
  }
  $http.post('/friendRequest', { user: $scope.user, friend: user})    //add a Friend to user;
  .then(function success(result) {
    var friend = result.data.friendRequest;
    console.log('friendRequests in database', friend);
    if($scope.theUser.username === user) {
      console.log('adding myself as a friend request');
      $scope.theUser.inviteFriend = friend;
    }
    
    $scope.notificationChecker();
 
    console.log('inviteFriend', $scope.theUser.inviteFriend);
  })
}

// CHANGE USER'S LOCATION
  $scope.changeLocation = function(locationData) {
    geocoder = new google.maps.Geocoder();  // init Geocoder

    locationData = $('#location-search').val();  // get the auto-complete address

    geocoder.geocode(    // get LatLng for given address
      {'address': locationData},
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          getMap(results[0].geometry.location, 14);  // redraw map with new location
          drawUserMarker(results[0].geometry.location);  // draw a new marker in the center of the map
          $scope.clickedPosition = results[0].geometry.location;  // searches will now be around the new marker
        } else {
          alert('Location change failed because: ' + status);
        }
    });
  };

// CREATE A PERSISTENT USER MARKER
  var drawUserMarker = function(position) {
    if (position == undefined) {
      position = $scope.map.getCenter();
    }

    userMarker = new google.maps.Marker({  // define new center marker
      position: position,
      icon: userMarkerImage
    });

    userMarker.setMap($scope.map);  // set the new center marker
  };

// DRAW A MAP WITH USER MARKER, ADD EVENT LISTENER TO REDRAW USER MARKER
  var getMap = function(latLngObj, zoomLevel) {
    $scope.map = new google.maps.Map(document.getElementById('map'), {  // draw map
      center: latLngObj,
      zoom: zoomLevel,
      disableDoubleClickZoom: true
    });

    infowindow = new google.maps.InfoWindow();  // init infowindow

    $scope.map.addListener('dblclick',  // double-click to set a flag
      function(event) {
        if (userMarker) {
          userMarker.setMap(null);
        }
        drawUserMarker(event.latLng);
        $scope.clickedPosition = event.latLng;
    });
  };

// GEOLOCATE USER'S POSITION
  $scope.userfind = function() {
    getMap(defaultLocation, 12);  // draw map with default location

    if (navigator.geolocation) {  // attempt geolocation if user allows
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var blueDotMarker = new google.maps.Marker({  // create blueDot marker for user's position
          position: $scope.userPosition,
          animation: google.maps.Animation.DROP,
          icon: blueDotImage
        });
        blueDotMarker.setMap($scope.map);  // set the blueDot marker

        $scope.map.setCenter($scope.userPosition);  // reset map with user position and closer zoom
        $scope.map.setZoom(14);
      },
      function() {  // error, but browser supports geolocation
        handleLocationError(true, infoWindow, $scope.map.getCenter());
      });
    } else {  // error, browser doesn't support geolocation
      handleLocationError(false, infoWindow, $scope.map.getCenter());
    }

     $scope.$apply();  // force update the $scope

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {  // this is specific to geolocation
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    };
  };

// CREATE MARKERS FOR SITES
  $scope.createMarker = function(place, keyword) {
    var placeLoc = place.geometry.location;
    var placeVicinity = place.vicinity;
    var placeName = place.name;
    var placeOpenNow;
    var placeOpenNowClass;

    if (place.opening_hours && place.opening_hours.open_now) {  // not all Places have opening_hours property, will error on variable assign if they don't
      placeOpenNow = 'Open to play right now!';
      placeOpenNowClass = 'open';
    } else if (place.opening_hours && !place.opening_hours.open_now) {
      placeOpenNow = 'Closed now, but check back again!';
      placeOpenNowClass = 'closed';
    } else {
      placeOpenNow = '';
      placeOpenNowClass = 'unknown';
    }

    var iconMarkerImg = sportIcons[keyword];  // see the sportIcons object at top
    
    var marker = new google.maps.Marker({  // draw the marker on the map
      map: $scope.map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      icon: iconMarkerImg
    });

    marker.addListener('click', function() { // add event listener for each marker
      $('*[data-placeId] .sitename').css("font-weight", "normal");  // make text for list item bold
      $('*[data-placeId=' + place.place_id + '] .sitename').css("font-weight", "bold");

      infowindow.setContent('<div class="infowindow-name">' + placeName + '</div><div class="infowindow-open ' + placeOpenNowClass + '">' + placeOpenNow + '</div><div class="infowindow-vicinity">' + placeVicinity + '</div');
      infowindow.open($scope.map, this);  // infowindow popup
    });

    markers.push(marker); // add each marker to markers array
  };

// CLICK EVENT LISTENER FOR SITE LIST
  $scope.siteListClick = function($index) {
    google.maps.event.trigger(markers[$index], 'click'); // trigger click event on respective marker
  };

// POPULATE SITE LIST FOR SELECTED SPORT
  $scope.populateList = function(keyword, sport, rankByFlag) {
    /* We killed the "rankBy / orderBy" functionality because the results didn't seem to make much sense.
    /* Google says RankBy.DISTANCE should give the closest results, but that doesn't seem to match up.
    /* To reinstate: add a way to select between DISTANCE/PROMINENCE in the UI, then use the rankByFlag
    /* to toggle, according to the code below.  */

    $scope.currentRankByFlag = rankByFlag;
    $scope.selectedSport = sport;
    
    if (keyword != undefined) { // if keyword is passed in, save it
      $scope.currentKeyword = keyword;
    }
    if ($scope.clickedPosition == undefined) {  // if no flag set, search around center of map
      searchLocation = $scope.map.getCenter();
    } else {  // otherwise search around flag
      searchLocation = $scope.clickedPosition;
    }
    
    var request = {
      location: searchLocation,  // determine current center of map
      keyword: [keyword]  // keyword to search from our search object
    };

    if (rankByFlag) {
      _.extend(request, { rankBy: google.maps.places.RankBy.DISTANCE });  // rank by Prominence is default, unless indicated by parameter
    } else {
      _.extend(request, { radius: '2000' });  // search radius in meters
    }

    _.each(markers, function(marker) {
      marker.setMap(null);  // reset current markers on map
    });

    markers = []; // clear markers array
    $scope.sitesResults = []; // clear site list

    var service = new google.maps.places.PlacesService($scope.map);  // init service
    service.nearbySearch(request, nearbySearchCallback);  // perform the search with given parameters
    function nearbySearchCallback(results, status) {  // this callback must handle the results object and the PlacesServiceStatus response

      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $scope.sitesResults = results; // populate site list with results
        $scope.$apply();  // force update the $scope
        
        _.each(results, function(place, index) {  // create markers for results
          $http.post('/siteinfo', place)  // post site info to server
            .then(function successCallback(response) {
              place.checkins = response.data.checkins;
              $scope.sitesResults[index].reviews = response.data.siteReviews;
              $scope.sitesResults[index].events = response.data.events;
              $scope.sitesResults[index].numberRating = response.data.numberRating;
              $scope.sitesResults[index].averageRating = response.data.averageRating;
              console.log("name", $scope.sitesResults[index].name, "numberRating", $scope.sitesResults[index].numberRating);        

            }, function errorCallback(error) {
              console.error('database post error: ', error);
            });
          $scope.createMarker(place, keyword);

        });
      }
    }
  };


//Event Object
 
// //Create an Event
  $scope.createEvent = function(place, index, event) {
    var container = {};
    container.place_id = place.place_id;
    container.sitename = place.name;
    container.events =
         {
          sport: $scope.selectedSport,
          date: event.date,
          numPlayers: event.numPlayers,
          time: event.times,
          place: place.name,
          comment: event.comment
        };
    $scope.sitesResults[index].events.push(container.events);
    console.log("events are here: ", $scope.sitesResults[index].events);

    $http.post('/eventinfo', container)
      .then(function successCallback(response) {
        console.log("Reponse in $scope.createEvent ", response);
      }, function errorCallback(error) {
          console.error("Failed in post eventinfo ", error);
      });
 
  };


// CHECKIN TO A SITE
  $scope.siteCheckin = function(site) {  // triggered by click on site checkin button
    $http.post('/checkin', site)  // makes a post request with the item that was clicked on
      .then(function successCallback(response) {
        site.checkins = response.data.checkins;
        site.checkedin = true;
      }, function errorCallback(response) {
        console.error('database post error: ', error);
      });
  };

  $scope.siteCheckout = function(site) {  // triggered by click on site checkout button
    $http.post('/checkout', site)  // makes a post request with the item that was clicked on
      .then(function successCallback(response) {
        site.checkins = response.data.checkins;
        site.checkedin = false;
      }, function errorCallback(response) {
        console.error('database post error: ', error);
      });
  };

  $scope.postReview = function(place_id, index, user, text) {
    var data = {};
    data.place_id = place_id;
    data.user = user;
    data.text = text;
    data.rating = $scope.rating;
    console.log('My rating is: ', $scope.rating);
    $http.post('/postReview', data)
      .then(function successCallback(response) {
        $scope.sitesResults[index].reviews = response.data.siteReviews;
        $scope.sitesResults[index].numberRating = response.data.numberRating;
        $scope.sitesResults[index].averageRating = response.data.averageRating;
      }, function errorCallback(error) {
        console.error('error in post review', error);
      });
  };

  $scope.rate = function(rating) {
    $scope.rating = rating;
  }
}]);


