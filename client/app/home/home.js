'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
  });
}])

.controller('homeController', ['$scope', '$log', function($scope, $log) {

  $scope.userfind = function(){

   var map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 37.7833, lng: -122.4167},
     zoom: 10
   });

   // Display the tooltip about the location
   //var infoWindow = new google.maps.InfoWindow({map: map});

 // Try HTML5 geolocation.
 if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function(position) {
     var pos = {
       lat: position.coords.latitude,
       lng: position.coords.longitude
     };

     var cityCircle = new google.maps.Circle({
       strokeColor: '#FFFFFF ',
       strokeOpacity: 1,
       strokeWeight: 2,
       fillColor: '#0000FF ',
       fillOpacity: 0.5,
       map: map,
       center: pos,
       radius: 50
     });

     // Tooltip position information
     //infoWindow.setPosition(pos);
     //infoWindow.setContent('Location found.');
     map.setCenter(pos);
     map.setZoom(14);


   }, function() {
     handleLocationError(true, infoWindow, map.getCenter());
   });
 } else {
   // Browser doesn't support Geolocation
   handleLocationError(false, infoWindow, map.getCenter());
 }
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
 infoWindow.setPosition(pos);
 infoWindow.setContent(browserHasGeolocation ?
   'Error: The Geolocation service failed.' :
   'Error: Your browser doesn\'t support geolocation.');
}

}]);


