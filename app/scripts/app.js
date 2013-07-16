'use strict';

angular.module('nextgearWebApp', ['$strap.directives', 'ui.state'])
  .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/home');

      $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })

      /**
       * Home State - Parent of Dashboard, Payments, Scheduled Payments,
       * Receipts and Floorplan states. Routing defaults to Home->Dashboard.
       */
        .state('home', {
            url: '/home',
            abstract: true,
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .state('home.dashboard', {
            url: '',
            templateUrl: 'views/home.dashboard.html'
        })
        .state('home.payments', {
            url: '/payments',
            templateUrl: 'views/home.payments.html'
        })
        .state('home.scheduledPayments', {
            url: '/scheduledPayments',
            templateUrl: 'views/home.scheduledpayments.html'
        })
        .state('home.receipts', {
            url: '/receipts',
            templateUrl: 'views/home.receipts.html'
        })
        .state('home.floorplan', {
            url: '/floorplan',
            templateUrl: 'views/home.floorplan.html'
        })

        .state('floorcar', {
            url: '/floorcar',
            templateUrl: 'views/floorcar.html',
            controller: 'FloorCarCtrl'
        })
        .state('reports', {
            url: '/reports',
            templateUrl: 'views/reports.html',
            controller: 'ReportsCtrl'
        })
        .state('analytics', {
            url: "/analytics",
            templateUrl: 'views/analytics.html',
            controller: 'AnalyticsCtrl'
        })
        .state('documents', {
            url: '/documents',
            templateUrl: 'views/documents.html',
            controller: 'DocumentsCtrl'
        })
  })
  .run(function($rootScope, $location) {

      /**
       * Returns true if the route requires authentication, false otherwise.
       * @param route
       * @returns {boolean}
       */
      var routeRequiresAuth = function(state) {
          switch(state.name) {
              case 'login':
              case 'forgotUsernameOrPassword':
                  return false;
              default:
                   return true;
          }
      };

      // listen for route changes
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toStateParams, fromState, fromStateParams) {
          if ($rootScope.authToken == null && routeRequiresAuth(toState)) {
              // not logged in, redirect to login screen
              $location.path('/login');
          }
      });
  });
