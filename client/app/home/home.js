// Unbalanced ()) Greenfield Project
// =============================================================================

'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
  });
}])

.controller('homeController', ['$scope', '$log', '$http', function($scope, $log, $http) {

// $SCOPE VARIABLES
  $scope.map;
  $scope.userPosition;
  $scope.sitesResults;
  $scope.currentKeyword;
  $scope.clickedPosition;
  $scope.currentRankByFlag;
  $scope.checkins;

// OTHER VARIABLES
  var defaultLocation = {
    lat: 37.7833,
    lng: -122.4167
  };
  var userMarkerImage = '../assets/images/centerFlag.png';
  var blueDotImage = '../assets/images/bluedot.png';
  var basketballImage = '../assets/images/basketball.png';
  var soccerballImage = '../assets/images/soccer.png';
  var squashballImage = '../assets/images/squash.png';
  var climbingImage = '../assets/images/climbing.png';
  var tennisballImage = '../assets/images/tennis.png';
  var softballImage = '../assets/images/softball.png';
  var gymImage = '../assets/images/gym.png';
  var golfballImage = '../assets/images/golf.png';
  var baseballImage = '../assets/images/baseball.png';
  var racketballImage = '../assets/images/racketball.png';

  var markers = [];
  var infowindow;
  var geocoder;
  var userMarker;
  var searchLocation;

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


// AUTH METHODS
  $scope.loginFacebook = function() {
    return $http({
      method: 'GET',
      url: '/auth/facebook'
    })
    .then(function (resp) {
      return resp.data;
    });
  };


// CHANGE USER'S LOCATION
  $scope.changeLocation = function(locationData) {
    geocoder = new google.maps.Geocoder();  // init Geocoder

    // Fix to get the google auto complete address
    locationData = $('#location-search').val();

    geocoder.geocode(    // get LatLng for given address
      {'address': locationData},
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          getMap(results[0].geometry.location, 14);  // redraw map with new location
          drawUserMarker(results[0].geometry.location);
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

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
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

    var iconMarkerImg;
    if (keyword === "Basketball Court") { iconMarkerImg = basketballImage; }
    if (keyword === "Soccer Field") { iconMarkerImg = soccerballImage; }
    if (keyword === "Tennis Court") { iconMarkerImg = tennisballImage; }
    if (keyword === "Baseball Field") { iconMarkerImg = baseballImage; }
    if (keyword === "Softball Field") { iconMarkerImg = softballImage; }
    if (keyword === "Gym") { iconMarkerImg = gymImage; }
    if (keyword === "Climbing Gym") { iconMarkerImg = climbingImage; }
    if (keyword === "Golf Course") { iconMarkerImg = golfballImage; }
    if (keyword === "Racquetball Court") { iconMarkerImg = racketballImage; }
    if (keyword === "Squash Court") { iconMarkerImg = squashballImage; }


    
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      icon: iconMarkerImg
    });

    marker.addListener('click', function() { // add event listener for each marker
      // Bolder the text in the site list
      $('*[data-placeId] .sitename').css("font-weight", "normal");
      $('*[data-placeId=' + place.place_id + '] .sitename').css("font-weight", "bold");

      // Show site info popin
      infowindow.setContent('<div class="infowindow-name">' + placeName + '</div><div class="infowindow-open ' + placeOpenNowClass + '">' + placeOpenNow + '</div><div class="infowindow-vicinity">' + placeVicinity + '</div');
      infowindow.open($scope.map, this);
    });

    markers.push(marker); // add each marker to markers array
  };

// CLICK EVENT LISTENER FOR SITE LIST
  $scope.siteListClick = function($index) {
    google.maps.event.trigger(markers[$index], 'click'); // trigger click event on respective marker

  };

// POPULATE SITE LIST FOR SELECTED SPORT
  $scope.populateList = function(keyword, sport, rankByFlag) {
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

    markers.forEach(function(marker) {
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
        
        results.forEach(function(place) {  // create markers for results
          $http.post('/siteinfo', place)  // post site info to server
            .then(function successCallback(response) {
              console.log('post request for ', place.name, ' successful!');
              console.log('checkins for this site: ', response.data.checkins);
              place.checkins = response.data.checkins;
            }, function errorCallback(response) {
              console.error('database post error: ', error);
            });
          $scope.createMarker(place, keyword);
        });
      }
    }
  };


// CHECKIN TO A SITE
  $scope.siteCheckin = function(site) {  // TODO: to be executed by a button click
    $http.post(url, site)  // makes a post request with the item that was clicked on
      .then(function successCallback(response) {
        console.log('checkin post request for ', site.name, ' successful!');
        console.log('updated checkins for this site: ', response.data.checkins);
  // TODO: UI updates with the new checkin count from server response
        
      }, function errorCallback(response) {
        console.error('database post error: ', error);
      });

  // possible problems:
    // mismatch between request/response bodies or the site body
    // does the site body have all the info about a site, like the site_place_id?
      // if not, how do we tie that info to each site?
    // still need UI updates for click event and to display the checkin count
  };

}]);

