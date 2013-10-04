'use strict';

angular.module('nextgearWebApp')
  .controller('LogoutCtrl', function($location, User) {

    User.logout();
    $location.path('/login');

  }
);
