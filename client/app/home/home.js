'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
  });
}])

.controller('homeController', ['$scope', '$log', function($scope, $log) {


  $scope.map;
  $scope.userpos;
  $scope.sitesResults;

  var infowindow;
  var markers = [];
  var geocoder;

  $scope.sports = {
    'Basketball' : 'Basketball Court',
    'Soccer' : 'Soccer Field',
    'Tennis' : 'Tennis Court',
    'Baseball' : 'Baseball Field',
    'Softball' : 'Softball Field',
    'Gym' : 'Gym',
    'Rock Climbing' : 'Climbing Gym',
    'Golf' : 'Golf Course',
    'Racquetball' : 'Racquetball Court',
    'Squash' : 'Squash Court'
    };

  $scope.changeLocation = function(locationData) {

    console.log('change location clicked!');

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address' : locationData}, function(results, status) {
      console.log('GEOCODER RESULTS', results);
      if (status == google.maps.GeocoderStatus.OK) {
        getMap(results[0].geometry.location, 14);
      } else {
        alert('Location Change Failed because' + status);
      }
    });

  };

  var getMap = function(latLngObj, zoomLevel){

    $scope.map = new google.maps.Map(document.getElementById('map'), {
     center: latLngObj,
     zoom: zoomLevel
   });

   infowindow = new google.maps.InfoWindow();
   var image = '../assets/images/centerFlag.png';

   var centerMarker = new google.maps.Marker({
      position : $scope.map.getCenter(),
      icon : image
   });

   //Marker for center of the map
   centerMarker.setMap($scope.map);
  };

  $scope.userfind = function(){

    var defaultLocation = {lat: 37.7833, lng: -122.4167};
    getMap(defaultLocation, 12);

   // Try HTML5 geolocation.
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
       $scope.userpos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };

       var cityCircle = new google.maps.Circle({
         strokeColor: '#FFFFFF ',
         strokeOpacity: 1,
         strokeWeight: 2,
         fillColor: '#0000FF ',
         fillOpacity: 0.5,
         map: $scope.map,
         center: $scope.userpos,
         radius: 50
       });

       // Tooltip position information
       //infoWindow.setPosition(pos);
       //infoWindow.setContent('Location found.');
       $scope.map.setCenter($scope.userpos);
       $scope.map.setZoom(14);


     }, function() {
       handleLocationError(true, infoWindow, $scope.map.getCenter());
     });
   } else {
     // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, $scope.map.getCenter());
   }

   $scope.$apply();

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
   infoWindow.setPosition(pos);
   infoWindow.setContent(browserHasGeolocation ?
     'Error: The Geolocation service failed.' :
     'Error: Your browser doesn\'t support geolocation.');
  }
  };

  $scope.createMarker = function(place) {
    console.log('anybody?');
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map : $scope.map,
      position: place.geometry.location
    });

    console.log(place);
    console.log('INSIDE CREATEMARKER');

    //Add an event listener for each marker
    marker.addListener('click', function(){
      console.log('MARKER CLICKED!!!');
      infowindow.setContent(place.name);
      infowindow.open($scope.map, this);
    });

    markers.push(marker);
    console.log('MARKERS ARRAY :', markers);
  };


  $scope.siteListClick = function($index){
    //trigger a click event on the markers[$index]
    google.maps.event.trigger(markers[$index], 'click');

  };

  $scope.populateList = function(keyword) {

    markers.forEach(function(marker) {
      //iterate over each marker, set them to null
      marker.setMap(null);
    });
    //Empty out  markers array
    markers = [];
    //Empty out siteResults list
    $scope.sitesResults = [];

    var request = {
        location: $scope.map.getCenter(),
        radius: '2000',  // search radius in meters
        keyword: [keyword]  // we need a way to insert user's selected sport(s) here
        // openNow: true,  // will only return Places that are currently open, remove if not desired ('false' has no effect)
        // rankBy: google.maps.places.RankBy.PROMINENCE or google.maps.places.RankBy.DISTANCE  // prominence is default
    };

    // console.log('request: ',request);

    var service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch(request, callback);

    // console.log(service)/
    function callback(results, status) {  // this callback must handle the results object and the PlacesServiceStatus response
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log("callback : ",results);
        $scope.sitesResults = results;
        $scope.$apply();
        // Invoke createMarker function to populate map with our results
        results.forEach(function(place){
          $scope.createMarker(place);
        });


      }
    }
  };

}]);


