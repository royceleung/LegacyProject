// Unbalanced ()) Greenfield Project
// =============================================================================

angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.home'
])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .otherwise({redirectTo: '/home'});
}])


.controller('mainController', ['$scope', '$cookies', function($scope, $cookies) {
  // Retrieving a cookie
  $scope.fbCookie = false;
  var fbCookie = $cookies.get('facebook');

  // Check if cookie exist
  if (fbCookie) {
    fbCookie = fbCookie.split('j:');
    fbCookie = JSON.parse(fbCookie[1]);

    // get User info from cookie
    var user = {
      'fbUserId' : fbCookie.fbId,
      'fbUserName' : fbCookie.fbUserName,
      'fbPicture' : fbCookie.fbPicture
    }
    $scope.user = user;
    $scope.fbCookie = true;
  }

}]);
