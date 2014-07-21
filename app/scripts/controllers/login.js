'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCtrl', function($rootScope, $scope, $location, User, $http, localStorageService, banner) {

    var savedUsername = localStorageService.get('rememberUsername');

    $scope.credentials = {
      username: savedUsername || '',
      password: '',
      remember: !!savedUsername
    };

    $scope.validity = {};

    $scope.showLoginError = false;

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

    $scope.saveUsername = function() {
      localStorageService.set('rememberUsername', $scope.credentials.remember ? $scope.credentials.username : '');
    };

    $scope.authenticate = function() {
      // VO-2579 - Set view value to the username and password fields in case the login credentials
      // were auto filled by the browser or an extension. This is a known Angular issue.
      //
      // source: https://github.com/angular/angular.js/issues/1460
      $scope.loginForm.credPassword.$setViewValue(angular.element('#credPassword').val());
      // Only update username if the value is actually different. Prevents typeahead
      // picker from opening on authenticate()
      var eleVal = angular.element('#credUsername').val();
      if($scope.credentials.username !== eleVal) {
        $scope.loginForm.credUsername.$setViewValue(eleVal);
      }

      $scope.validity = $scope.validity = angular.copy($scope.loginForm);

      if ($scope.credentials.username && $scope.credentials.password) {
        User.authenticate($scope.credentials.username, $scope.credentials.password)
          .then(function(data) {
            $rootScope.$broadcast('event:userAuthenticated', data);
            $scope.saveAutocompleteUsername($scope.credentials.username);
            $scope.saveUsername();
          }, function(error) {
            error.dismiss();
            $scope.errorMsg = error.text;
            $scope.showLoginError = true;
            $scope.credentials.password = '';
          });
      }
    };

    if(!localStorageService.get('autocompleteUsernames')){
      localStorageService.set('autocompleteUsernames', []);
    }
    $scope.autocompleteUsernames = localStorageService.get('autocompleteUsernames');

    // load banner information
    banner.fetch(function(text) {
        if (text) {
          $scope.bannerText = text;
        }
        $scope.showBanner = !!text; // cast to bool
      }
    );

  }
);
