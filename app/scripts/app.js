'use strict';

angular.module('nextgearWebApp', ['$strap.directives'])
  .config(function($routeProvider) {
      $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/floorcar', {
            templateUrl: 'views/floorcar.html',
            controller: 'FloorCarCtrl'
        })
        .when('/reports', {
            templateUrl: 'views/reports.html',
            controller: 'ReportsCtrl'
        })
        .when('/analytics', {
            templateUrl: 'views/analytics.html',
            controller: 'AnalyticsCtrl'
        })
        .when('/documents', {
            templateUrl: 'views/documents.html',
            controller: 'DocumentsCtrl'
        })
        .otherwise({ redirectTo: '/home' });
  })
  .run(function($rootScope, $location) {

      /**
       * Returns true if the route requires authentication, false otherwise.
       * @param route
       * @returns {boolean}
       */
      var routeRequiresAuth = function(route) {
          switch(route.templateUrl) {
              case 'views/login.html':
              case 'views/forgotUsernameOrPassword.html':
                  return false;
              default:
                   return true;
          }
      };

      // listen for route changes
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
          if ($rootScope.authToken == null && routeRequiresAuth(next)) {
              // not logged in, redirect to login screen
              $location.path('/login');
          }
      });
  });
