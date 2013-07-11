'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($scope, $http, $location) {

      $scope.credentials = {
          username: "",
          password: ""
      };

      $scope.authenticate = function() {
          console.log("authenticating with: " + $scope.credentials.username + "/" + $scope.credentials.password);
          $http.post(
            '/Authentication/',
            {
                Username: $scope.credentials.username,
                Password: $scope.credentials.password
            })
            .success(function(response) {
                console.log(["Login success"]);
                $location.path('/main');
            })
            .error(function(response) {
                console.error(["Login error"]);
            });
      }
  }
);
