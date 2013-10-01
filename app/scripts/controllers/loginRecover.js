'use strict';

angular.module('nextgearWebApp')
  .controller('LoginRecoverCtrl', function ($scope) {

    $scope.identity = {
      securityQuestion: 'Where did you attend high school?',
      securityAnswer: 'chsn',
      showQuestion: false
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

  });
