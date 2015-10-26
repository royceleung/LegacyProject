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


  $scope.userfind = function(){

   $scope.map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 37.7833, lng: -122.4167},
     zoom: 10
   });

   infowindow = new google.maps.InfoWindow();
   // Display the tooltip about the location
   //var infoWindow = new google.maps.InfoWindow({map: map});

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
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map : $scope.map,
      position: place.geometry.location
    });

    console.log(place);

        //Add an event listener for each marker
    google.maps.event.addListener(marker, 'click', function(){
      infowindow.setContent(place.name);
      infowindow.open($scope.map, this);
    });

  };



  $scope.filter = function() {

    console.log("filter");

    console.log('userpos', $scope.userpos);
    var request = {
        location: $scope.userpos,
        radius: '2000',  // search radius in meters
        keyword: ['basketball court']  // we need a way to insert user's selected sport(s) here
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


