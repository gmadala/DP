'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $http, $location, Base64) {

    $scope.credentials = {
        username: "",
        password: ""
    };

    $scope.forgot = false;

    $scope.authenticate = function() {
      console.log("authenticating with: " + $scope.credentials.username + "/" + $scope.credentials.password);
      $http.post(
        '/UserAccount/Authenticate/',
        {
            Authorization: "CT " +
              Base64.encode($scope.credentials.username + ":" + $scope.credentials.password)
        })
        .success(function(response) {
          if (response.Success) {
            console.log(["Login success"]);
            $rootScope.authToken = response.Data;
            $location.path('/home');
          }
          else {
            $rootScope.authToken = null;
          }
        })
        .error(function(response) {
            console.error(["Login error"]);
        });
    }
  }
);
