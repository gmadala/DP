'use strict';

angular.module('nextgearWebApp', ['ui.state', 'ui.bootstrap', 'infinite-scroll', 'ui.calendar'])
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
        templateUrl: 'views/home.dashboard.html',
        controller: 'DashboardCtrl'
      })
      .state('home.payments', {
        url: '/payments',
        templateUrl: 'views/home.payments.html',
        controller: 'PaymentsCtrl'
      })
      .state('home.scheduledPayments', {
        url: '/scheduledPayments',
        templateUrl: 'views/home.scheduledpayments.html',
        controller: 'ScheduledCtrl'
      })
      .state('home.receipts', {
        url: '/receipts',
        templateUrl: 'views/home.receipts.html',
        controller: 'ReceiptsCtrl'
      })
      .state('home.floorplan', {
        url: '/floorplan',
        templateUrl: 'views/home.floorplan.html',
        controller: 'FloorplanCtrl'
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
        url: '/analytics',
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsCtrl'
      })
      .state('documents', {
        url: '/documents',
        templateUrl: 'views/documents.html',
        controller: 'DocumentsCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      });
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
      function(event, toState /*, toStateParams, fromState, fromStateParams*/) {
        if (!angular.isDefined($rootScope.authToken) && routeRequiresAuth(toState)) {
          // not logged in, redirect to login screen
          $location.path('/login');
        }
      }
    );
  });
