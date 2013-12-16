'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $location, User, $http, localStorageService) {

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
            $scope.saveAutocompleteUsername($scope.credentials.username);
          }, function(error) {
            error.dismiss();
            $scope.errorMsg = error.text;
            $scope.showLoginError = true;
          });
      }
    };

    if(!localStorageService.get('autocompleteUsernames')){
      localStorageService.set('autocompleteUsernames', []);
    }
    $scope.autocompleteUsernames = localStorageService.get('autocompleteUsernames');

    $scope.saveAutocompleteUsername = function(username){

      // If username already is saved remove it so it can be
      // re-added to the end of the array.
      var index = $scope.autocompleteUsernames.indexOf(username);
      if(index !== -1){
        $scope.autocompleteUsernames.splice(index, 1);
      }
      $scope.autocompleteUsernames.push(username);


      if($scope.autocompleteUsernames.length > 10){
        $scope.autocompleteUsernames.splice(0,1);
      }
      localStorageService.set('autocompleteUsernames', $scope.autocompleteUsernames);

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
