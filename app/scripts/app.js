'use strict';

angular.module('nextgearWebApp', ['ui.state', 'ui.bootstrap', '$strap.directives', 'ui.calendar', 'ui.highlight',
  'ui.event', 'segmentio', 'ngCookies', 'ngSanitize', 'LocalStorageModule', 'gettext', 'nextgearWebCommon'])
  .constant('SupportedLanguages', [
    { key: 'en', id: 1, name: 'English' },
    { key: 'enDebug', id: 1, name: 'English (Debug)' },
    { key: 'fr_CA', id: 2, name: 'French (CA)' },
    { key: 'es', id: 3, name: 'Spanish' }
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector) {
      var User = $injector.get('User');
      if (User.isLoggedIn()) {
        return User.isDealer() ? '/home' : '/act/home';
      } else {
        return '/login';
      }
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        pageID: 'Login',
        allowAnonymous: true,
        margin: 'no-left-margin'
      })
      .state('maintenance', {
        url: '/maintenance',
        templateUrl: 'views/maintenance.html',
        controller: 'MaintenanceCtrl',
        pageID: 'Maintenance',
        allowAnonymous: true
      })
      .state('loginRecover', {
        url: '/login/recover',
        templateUrl: 'views/login.recover.html',
        controller: 'LoginRecoverCtrl',
        pageID: 'LoginRecover',
        allowAnonymous: true,
        noDirectAccess: true,
        margin: 'no-left-margin'
      })
      .state('loginUpdateSecurity', {
        url: '/login/updateSecurity',
        templateUrl: 'views/login.updateSecurity.html',
        controller: 'LoginUpdateSecurityCtrl',
        pageID: 'LoginUpdateSecurity',
        noDirectAccess: true
      })
      .state('loginCreatePassword', {
        url: '/login/createPassword',
        templateUrl: 'views/login.createPassword.html',
        controller: 'LoginCreatePasswordCtrl',
        pageID: 'LoginCreatePassword',
        noDirectAccess: true
      })

      .state('dashboard', {
        url: '/home',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        pageID: 'Dashboard',
        showNavBar: true
      })
      .state('payments', {
        url: '/payments?filter',
        templateUrl: 'views/payments.html',
        controller: 'PaymentsCtrl',
        pageID: 'Payments',
        showNavBar: true
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: 'views/checkout.html',
        controller: 'CheckoutCtrl',
        pageID: 'Checkout',
        showNavBar: true
      })
      .state('receipts', {
        url: '/receipts',
        templateUrl: 'views/receipts.html',
        controller: 'ReceiptsCtrl',
        pageID: 'Receipts',
        showNavBar: true
      })
      .state('floorplan', {
        url: '/floorplan?filter',
        templateUrl: 'views/floorplan.html',
        controller: 'FloorplanCtrl',
        pageID: 'Floorplan',
        showNavBar: true
      })
      .state('titlereleases', {
        url: '/titlereleases',
        templateUrl: 'views/titlereleases.html',
        controller: 'TitleReleasesCtrl',
        pageID: 'TitleReleases',
        showNavBar: true
      })
      .state('titleReleaseCheckout', {
        url: '/titlereleasecheckout',
        templateUrl: 'views/titlereleasecheckout.html',
        controller: 'TitleReleaseCheckoutCtrl',
        pageID: 'TitleReleasesCheckout',
        showNavBar: true
      })

      .state('vehicledetails', {
        url: '/vehicledetails?stockNumber',
        templateUrl: 'views/vehicledetails.html',
        controller: 'VehicleDetailsCtrl',
        pageID: 'VehicleDetails',
        showNavBar: true
      })
      .state('floorcar', {
        url: '/floorcar',
        templateUrl: 'views/floorcar.html',
        controller: 'FloorCarCtrl',
        pageID: 'FloorCar',
        showNavBar: true
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl',
        pageID: 'Reports',
        showNavBar: true
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsCtrl',
        pageID: 'Analytics',
        showNavBar: true
      })
      .state('documents', {
        url: '/documents',
        templateUrl: 'views/documents.html',
        controller: 'DocumentsCtrl',
        pageID: 'Documents',
        showNavBar: true
      })
      .state('profile_settings', {
        url: '/profile_settings',
        templateUrl: 'views/profileSettings.html',
        controller: 'ProfileSettingsCtrl',
        pageID: 'ProfileSettings',
        showNavBar: true
      })
      .state('account_management', {
        url: '/account_management',
        templateUrl: 'views/account_management.html',
        controller: 'AccountManagementCtrl',
        pageID: 'AccountManagement',
        showNavBar: true
      })
      .state('valueLookup', {
        url: '/valueLookup',
        templateUrl: 'views/valuelookup.html',
        controller: 'ValueLookupCtrl',
        pageID: 'ValueLookup',
        showNavBar: true
      })

      // AUCTION STATES
      .state('auction_dashboard', {
        url: '/act/home',
        templateUrl: 'views/auction.dashboard.html',
        controller: 'AuctionDashboardCtrl',
        pageID: 'AuctionDashboard',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_dealersearch', {
        url: '/act/dealersearch',
        templateUrl: 'views/auction.dealersearch.html',
        controller: 'AuctionDealerSearchCtrl',
        pageID: 'AuctionDealerSearch',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_bulkflooring', {
        url: '/act/bulkflooring',
        templateUrl: 'views/auction.bulkflooring.html',
        controller: 'FloorCarCtrl',
        pageID: 'AuctionFloorCar',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_sellerfloorplan', {
        url: '/act/sellerfloorplan',
        templateUrl: 'views/auction.sellerfloorplan.html',
        controller: 'FloorplanCtrl',
        pageID: 'AuctionFloorplan',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_reports', {
        url: '/act/reports',
        templateUrl: 'views/auction.reports.html',
        controller: 'AuctionReportsCtrl',
        pageID: 'AuctionReports',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_documents', {
        url: '/act/documents',
        templateUrl: 'views/auction.documents.html',
        controller: 'AuctionDocumentsCtrl',
        pageID: 'AuctionDocuments',
        isAuctionState: true,
        showNavBar: true
      })
      .state('auction_settings', {
        url: '/act/settings',
        templateUrl: 'views/auction.settings.html',
        controller: 'AuctionSettingsCtrl',
        pageID: 'AuctionSettings',
        isAuctionState: true,
        showNavBar: true
      })
    ;

  })
  .run(function($rootScope, $location, User, $window, segmentio, nxgConfig, LogoutGuard, $cookieStore, $state, $dialog,
                LastState, api, metric, gettextCatalog, language, features) {
    //set metric constants on root scope so they are always available
    $rootScope.metric = metric;

    var prv = {
      reloadPending: false,

      resetToLogin: function() {
        prv.reloadPending = true;
        // set location as login page before refreshing to stop pendingState from being set
        window.location.hash = '/login';
        // clobber everything and start over at login page
        // LastState cookie modifications are asynchronous
        window.location.reload(true);
      },

      continuePostLoginTransition: function() {
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
      },

      isStateInappropriateForRole: function(state, isDealer) {
        return (state.isAuctionState && isDealer) || (!state.isAuctionState && !isDealer);
      }
    };

    LogoutGuard.watchForLogoutAttemptByURLState();
    segmentio.load(nxgConfig.segmentIoKey);

    // state whose transition was interrupted to ask the user to log in
    var pendingState = null;

    // listen for route changes
    $rootScope.$on('$stateChangeStart',
      function(event, toState , toStateParams/*, fromState, fromStateParams*/) {
        if (prv.reloadPending) {
          // prevent state change since we're reloading anyway
          event.preventDefault();
          return;
        }

        // If there are dialogs open and we aren't going to login state to popup the login "are you sure?" modal
        if ($dialog.openDialogsCount() > 0 && !(toState.name ==='login' && api.hasAuthToken())) {
          /**
           * if a dialog is open, close it before navigating to new state
           * but not for login, because the logout function already closes
           * all dialogs.
           */
          $dialog.closeAll();
        }

        if (!toState.allowAnonymous) {
          // enforce rules about what states certain users can see
          var isDealer = User.isDealer(),
            savedAuth = $cookieStore.get('auth');

          if (!User.isLoggedIn() && savedAuth) {
            // we're restoring session from saved auth token
            event.preventDefault();
            User.initSession(savedAuth).then(
              function() {
                $state.transitionTo(toState, toStateParams);
              }
            );
          }
          else if (!User.isLoggedIn()) {
            // not logged in; redirect to login screen
            event.preventDefault();
            pendingState = toState; // save the original state destination to switch back when logged in
            $location.path('/login');
          } else if (User.isPasswordChangeRequired()) {
            // temporary password? user needs to change it before it can proceed
            if (toState.name !== 'loginCreatePassword'){
              $location.path('/login/createPassword');
            }
          } else if (User.isUserInitRequired()) {
            // not initialized? lets update the security questions
            if (toState.name !== 'loginUpdateSecurity') {
              $location.path('/login/updateSecurity');
            }
          } else if (prv.isStateInappropriateForRole(toState, isDealer) || toState.noDirectAccess) {
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
            // we don't need to clear the user state here, because it's
            // done on userAuthentication (see below)
            prv.resetToLogin();
          }
        });
      }
    );

    $rootScope.$on('event:forceLogout',
      function(){
        // For IE9 support, must run a digest cycle after setting the cookie
        // and before reloading to make sure the cookie gets set before
        // reload. Make sure not to disrupt a currently running digest.
        if(!$rootScope.$$phase) {
          $rootScope.$digest();
        }
        prv.resetToLogin();
      }
    );

    $rootScope.$on('event:forceClearAuth',
      function(){
        User.dropSession();
        // save last visited state
        LastState.saveUserState();
      }
    );

    $rootScope.$on('event:userAuthenticated',
      function(){
        if (User.isPasswordChangeRequired()) {
          // temporary password? user needs to change it before it can proceed
          $location.path('/login/createPassword');
        }
        else if (User.isUserInitRequired()) {
          $location.path('/login/updateSecurity');
        }
        else {
          prv.continuePostLoginTransition();
        }
      }
    );
    $rootScope.$on('event:temporaryPasswordChanged',
      function() {
        if (User.isUserInitRequired()) {
          $location.path('/login/updateSecurity');
        }
        else {
          prv.continuePostLoginTransition();
        }
      }
    );

    // Set language from cookie
    language.loadLanguage();

    features.loadFromQueryString();

  });
