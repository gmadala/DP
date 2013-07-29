'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $http, $location, Base64, apiBaseUrl) {

    $scope.credentials = {
        username: "",
        password: ""
    };

    $scope.identity = {
      securityQuestion: 'Where did you attend high school?',
      securityAnswer: 'chsn',
      showQuestion: false
    };

    // TODO: Replace these mock variables with actual ones.
    $scope.forgot = false;
    $scope.forgotten = 'password';

    // TODO: Set which one is active based on which one user interacts with first?
    $scope.pClass = $scope.forgotten == 'username' ? 'nxg-fade' : '';
    $scope.uClass = $scope.forgotten == 'password' ? 'nxg-fade' : '';

    $scope.authenticate = function() {
      console.log("authenticating with: " + $scope.credentials.username + "/" + $scope.credentials.password);

      $http.post(
        apiBaseUrl.get() + '/UserAccount/Authenticate/',
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

    $scope.onForgotPasswordSubmit = function() {
      // TODO: Grab security question and answer data
      $scope.identity.showQuestion = true;

      // TODO: Determine if it's submitting the username or the
      // question/answer, and handle accordingly.
    }
  }
);
