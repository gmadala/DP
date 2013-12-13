'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $location, User, $http) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.showLoginError = false;

    $scope.authenticate = function() {
      if ($scope.credentials.username && $scope.credentials.password) {
        User.authenticate($scope.credentials.username, $scope.credentials.password)
          .then(function(/*data*/) {
            $rootScope.$broadcast('event:userAuthenticated');
          }, function(error) {
            error.dismiss();
            $scope.errorMsg = error.text;
            $scope.showLoginError = true;
          });
      }
    };

    // load banner information
    $http.get('banner.txt').success(
      function(data, status) {
        if (data && status === 200) {
          $scope.bannerText = data;
          console.log('bannerText =' + data);
        }
        $scope.showBanner = !!data; // cast to bool
      }
    );

  }
);
