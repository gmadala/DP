'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $http, $location, Base64, nxgConfig, User) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.showLoginError = false;

    $scope.identity = {
      securityQuestion: 'Where did you attend high school?',
      securityAnswer: 'chsn',
      showQuestion: false
    };

    // TODO: Replace these mock variables with actual ones.
    $scope.forgot = false;

    $scope.authenticate = function() {
      User.authenticate($scope.credentials.username, $scope.credentials.password)
        .then(function(/*data*/) {
          $location.path('/home');
        }, function(/*error*/) {
          $scope.showLoginError = true;
        });
    };

    $scope.onForgotUsernameSubmit = function() {
      console.log('forgot username');
      $scope.uValidity = angular.copy($scope.forgotUsername);
      if (!$scope.forgotUsername.$valid) {
        return false;
      }
    };

    $scope.onForgotPasswordSubmit = function() {
      console.log('forgot password');
       // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.pValidity = angular.copy($scope.forgotPassword);
      if (!$scope.forgotPassword.$valid) {
        return false;
      }

      // TODO: Grab security question and answer data
      $scope.identity.showQuestion = true;

      // TODO: Determine if it's submitting the username or the
      // question/answer, and handle accordingly.
    };
  }
);
