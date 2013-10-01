'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $http, $location, Base64, nxgConfig, User) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.showLoginError = false;

    $scope.authenticate = function() {
      User.authenticate($scope.credentials.username, $scope.credentials.password)
        .then(function(/*data*/) {
          $location.path('/home');
        }, function(error) {
          error.dismiss();
          $scope.showLoginError = true;
        });
    };

  }
);
