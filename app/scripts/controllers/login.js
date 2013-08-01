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
      console.log('authenticating with: ' + $scope.credentials.username + '/' + $scope.credentials.password);

      User.authenticate($scope.credentials.username, $scope.credentials.password)
        .then(function(data) {
          User.isLogged = true;
          $rootScope.$broadcast('AuthenticationSuccess');
          $location.path('/home');
        }, function(error) {
          $scope.showLoginError = true;
        });
    };

    $scope.onForgotPasswordSubmit = function() {
      // TODO: Grab security question and answer data
      $scope.identity.showQuestion = true;

      // TODO: Determine if it's submitting the username or the
      // question/answer, and handle accordingly.
    };
  }
);
