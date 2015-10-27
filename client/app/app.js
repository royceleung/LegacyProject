// Unbalanced ()) Greenfield Project
// =============================================================================

angular.module('myApp', [
  'ngRoute',
  'myApp.home'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .otherwise({redirectTo: '/home'});
}])

.controller('View1Ctrl', ['$scope', function($scope) {

}]);
