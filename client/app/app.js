// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])
.controller('View1Ctrl', ['$scope', function($scope) {


}]);


