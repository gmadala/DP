'use strict';

angular.module('nextgearWebApp', ['ui.state', 'ui.bootstrap', '$strap.directives', 'infinite-scroll', 'ui.calendar'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        allowAnonymous: true
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
        url: '/payments?filter',
        templateUrl: 'views/home.payments.html',
        controller: 'PaymentsCtrl'
      })
      .state('home.scheduledPayments', {
        url: '/scheduledPayments',
        templateUrl: 'views/home.scheduledpayments.html',
        controller: 'ScheduledCtrl'
      })
      .state('home.receipts', {
        url: '/receipts?search',
        templateUrl: 'views/home.receipts.html',
        controller: 'ReceiptsCtrl'
      })
      .state('home.floorplan', {
        url: '/floorplan?filter',
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
  .run(function($rootScope, $location, User) {

    // listen for route changes
    $rootScope.$on('$stateChangeStart',
      function(event, toState /*, toStateParams, fromState, fromStateParams*/) {
        if (!User.isLoggedIn() && !toState.allowAnonymous) {
          // not logged in, redirect to login screen
          $location.path('/login');
        }
      }
    );
  });
