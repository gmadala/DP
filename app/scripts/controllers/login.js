'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($scope, $location, User) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.showLoginError = false;

    $scope.authenticate = function() {
      if ($scope.credentials.username && $scope.credentials.password) {
        User.authenticate($scope.credentials.username, $scope.credentials.password)
          .then(function(/*data*/) {
            $location.path('/home');
          }, function(error) {
            error.dismiss();
            $scope.errorMsg = error.text;
            $scope.showLoginError = true;
          });
      }
    };

  }
);
