'use strict';

angular.module('nextgearWebApp', ['ui.state', 'ui.bootstrap', '$strap.directives', 'ui.calendar', 'ui.highlight', 'ui.event', 'segmentio', 'ngCookies', 'LocalStorageModule'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise(function($injector) {
      var User = $injector.get('User');
      return User.isDealer() ? '/home' : '/act/home';
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        allowAnonymous: true,
        hideNavBar: true
      })
      .state('loginRecover', {
        url: '/login/recover',
        templateUrl: 'views/login.recover.html',
        controller: 'LoginRecoverCtrl',
        allowAnonymous: true,
        hideNavBar: true
      })
      .state('loginUpdateSecurity', {
        url: '/login/updateSecurity',
        templateUrl: 'views/login.updateSecurity.html',
        controller: 'LoginUpdateSecurityCtrl',
        hideNavBar: true
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
      .state('home.checkout', {
        url: '/checkout',
        templateUrl: 'views/home.checkout.html',
        controller: 'CheckoutCtrl'
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
      .state('feedback', {
        url: '/feedback',
        templateUrl: 'views/feedback.html',
        controller: 'FeedbackCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })

      // AUCTION STATES
      .state('auction_home', {
        url: '/act/home',
        abstract: true,
        templateUrl: 'views/auction.home.html',
        controller: 'AuctionHomeCtrl',
        isAuctionState: true
      })
      .state('auction_home.dashboard', {
        url: '',
        templateUrl: 'views/auction.home.dashboard.html',
        controller: 'AuctionDashboardCtrl',
        isAuctionState: true
      })
      .state('auction_home.dealersearch', {
        url: '/dealersearch',
        templateUrl: 'views/auction.home.dealersearch.html',
        controller: 'AuctionDealerSearchCtrl',
        isAuctionState: true
      })
      .state('auction_home.bulkflooring', {
        url: '/bulkflooring',
        templateUrl: 'views/auction.home.bulkflooring.html',
        controller: 'FloorCarCtrl',
        isAuctionState: true
      })
      .state('auction_home.sellerfloorplan', {
        url: '/sellerfloorplan',
        templateUrl: 'views/auction.home.sellerfloorplan.html',
        controller: 'FloorplanCtrl',
        isAuctionState: true
      })
      .state('auction_reports', {
        url: '/act/reports',
        templateUrl: 'views/auction.reports.html',
        controller: 'AuctionReportsCtrl',
        isAuctionState: true
      })
      .state('auction_documents', {
        url: '/act/documents',
        templateUrl: 'views/auction.documents.html',
        controller: 'AuctionDocumentsCtrl',
        isAuctionState: true
      })
      .state('auction_settings', {
        url: '/act/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        isAuctionState: true
      })
    ;

  })
  .run(function($rootScope, $location, User, $window, segmentio, nxgConfig, LogoutGuard, $cookieStore, $state, $dialog, LastState) {
    LogoutGuard.watchForLogoutAttemptByURLState();

    segmentio.load(nxgConfig.segmentIoKey);

    // state whose transition was interrupted to ask the user to log in
    var pendingState = null;

    // listen for route changes
    $rootScope.$on('$stateChangeStart',
      function(event, toState /*, toStateParams, fromState, fromStateParams*/) {
        if (!toState.allowAnonymous) {
          // enforce rules about what states certain users can see

          var isDealer = User.isDealer(),
            savedAuth = $cookieStore.get('auth');

          if (!User.isLoggedIn() && savedAuth) {
            // we're restoring session from saved auth token
            event.preventDefault();
            User.initSession(savedAuth).then(
              function() {
                $state.transitionTo(toState);
              }
            );
          }

          else if (!User.isLoggedIn()) {
            // not logged in; redirect to login screen
            event.preventDefault();
            pendingState = toState; // save the original state destination to switch back when logged in
            $location.path('/login');
          } else if (User.isUserInitRequired()) {
            // not initialized? lets update the security questions
            $location.path('/login/updateSecurity');
          } else if ((toState.isAuctionState && isDealer) || (!toState.isAuctionState && !isDealer)) {
            // user is trying to access a state that's not appropriate to their role; redirect to their home
            event.preventDefault();
            // If auction user, go to /act/home. On page load, isDealer is null, but assume
            // that still means it's a dealer until API call corrects this.
            $location.path(isDealer || isDealer === null ? '/home' : '/act/home');
          }
        }

      }
    );

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      if (fromState.name) {
        segmentio.page(null, null, {
          path: $location.path(),
          url: $location.absUrl(),
          title: $location.path()
        });
      }
    });

    $rootScope.$on('event:switchState', function(event, state) {
      $location.path(state.url);
    });

    $rootScope.$on('event:userRequestedLogout',
      function() {
        $dialog.closeAll();
        $dialog.dialog({
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/confirmLogout.html',
          controller: 'ConfirmLogoutCtrl'
        }).open().then(function(confirmed) {
          // dialog controller did User.logout() so it could block until that finished
          if (confirmed) {
            LastState.clearUserState();

            // For IE9 support, must run a digest cycle after setting the cookie
            // and before reloading to make sure the cookie gets set before
            // reload
            $rootScope.$digest();

            // set location as login page before refreshing to stop pendingState from being set
            window.location.hash = '/login';
            // clobber everything and start over at login page
            // LastState cookie modifications are asynchronous
            window.location.reload(true);
          }
        });
      }
    );

    $rootScope.$on('event:forceLogout',
      function(){
        User.dropSession();
        // save last visited state
        LastState.saveUserState();

        // For IE9 support, must run a digest cycle after setting the cookie
        // and before reloading to make sure the cookie gets set before
        // reload
        $rootScope.$digest();

        // set location as login page before refreshing to stop pendingState from being set
        window.location.hash = '/login';
        // clobber everything and start over at login page
        // LastState cookie modifications are asynchronous
        window.location.reload(true);
      }
    );

    $rootScope.$on('event:userAuthenticated',
      function(){
        if (pendingState) {
          $state.transitionTo(pendingState.name); // resume transition to the original state destination
          pendingState = null;
        }
        else {
          // Make sure we got a valid last state to switch to. Fixes VO-804
          if (LastState.getUserState() && LastState.getUserState() !== '') {
            $state.transitionTo(LastState.getUserState()); // go back to the last state visited
            LastState.clearUserState();
          }
          else {
            $location.path(User.isDealer() ? '/home' : '/act/home');
          }
        }
      }
    );

  });
