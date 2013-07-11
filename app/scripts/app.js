'use strict';

angular.module('nextgearWebApp', [])
  .config(function($routeProvider) {
      $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/main', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({ redirectTo: '/login' });
  });
