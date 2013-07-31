'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $http, $location, Base64, nxgConfig) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.identity = {
      securityQuestion: 'Where did you attend high school?',
      securityAnswer: 'chsn',
      showQuestion: false
    };

    // TODO: Replace these mock variables with actual ones.
    $scope.forgot = false;

    $scope.authenticate = function() {
      console.log('authenticating with: ' + $scope.credentials.username + '/' + $scope.credentials.password);

      $http.post(
        nxgConfig.apiBase + '/UserAccount/Authenticate/',
        {
          Authorization: 'CT ' + Base64.encode($scope.credentials.username + ':' + $scope.credentials.password)
        })
        .success(function(response) {
          if (response.Success) {
            console.log(['Login success']);
            $rootScope.authToken = response.Data;
            $location.path('/home');
          }
          else {
            $rootScope.authToken = null;
          }
        })
        .error(function(error) {
          console.error('Login error', error);
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
