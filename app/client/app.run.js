(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .run(initialize);

  initialize.$inject = [
    '$rootScope',
    '$window',
    'User',
    'segmentio',
    'nxgConfig',
    'LogoutGuard',
    '$cookieStore',
    'localStorageService',
    '$state',
    '$uibModal',
    'LastState',
    'api',
    'metric',
    'language',
    'features',
    'kissMetricInfo',
    'resize'
  ];

  function initialize(
    $rootScope,
    $window,
    User,
    segmentio,
    nxgConfig,
    LogoutGuard,
    $cookieStore,
    localStorageService,
    $state,
    $uibModal,
    LastState,
    api,
    metric,
    language,
    features,
    kissMetricInfo,
    resize) {

    var uibModal = $uibModal;
    // state whose transition was interrupted to ask the user to log in
    var pendingState = null;
    //set metric constants on root scope so they are always available
    $rootScope.metric = metric;
    // prompt with logout dialog if user press back after login
    LogoutGuard.watchForLogoutAttemptByURLState();
    // load the correct tracking configuration
    segmentio.load(nxgConfig.segmentIoKey);
    // set language from cookie
    language.loadLanguage();
    // set enabled features
    features.loadFromQueryString();

    var prv = {
      pendingReload: false,
      resetToLogin: resetToLogin,
      continuePostLogin: continuePostLogin,
      isStateNotForRole: isStateNotForRole
    };

    function resetToLogin() {
      localStorageService.remove('userData')
      $state.go('login');
      prv.pendingReload = true;
    }

    function continuePostLogin() {
      if (pendingState) {
        // resume transition to the original state destination
        $state.go(pendingState.name);
        pendingState = null;
      } else {
        // Make sure we got a valid last state to switch to. Fixes VO-804
        if (LastState.getUserState() && LastState.getUserState() !== '') {
          // go back to the last state visited
          $state.transitionTo(LastState.getUserState());
          LastState.clearUserState();
        } else {
          $state.go(User.isDealer() ? 'dashboard' : 'auction_dashboard');
        }
      }
    }

    function isStateNotForRole(state, isDealer) {
      return ( state.data.isAuctionState && isDealer ) || ( !state.data.isAuctionState && !isDealer );
    }

    function isMobile() {
      $rootScope.isMobile = resize.isMobile();
    }

    isMobile();

    angular.element($window).bind('resize', function () {
      isMobile();
    });

    // listen for route changes
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toStateParams) {
        // If there are dialogs open and we aren't going to login state to popup the login "are you sure?" modal
        /* if (uibModal.openDialogsCount() > 0 && !(toState.name === 'login' && api.hasAuthToken())) {
         /!**
         * if a dialog is open, close it before navigating to new state
         * but not for login, because the logout function already closes
         * all dialogs.
         *!/
         uibModal.closeAll();
         }
         */

        $rootScope.currentPage = toState.data.title;
        var savedAuth = localStorageService.get('userData');
        if (!toState.data.allowAnonymous) {
          // enforce rules about what states certain users can see
          var isDealer = User.isDealer();

          if (!User.isLoggedIn() && savedAuth) {
            // we're restoring session from saved auth token
            event.preventDefault();
            User.initSession(savedAuth).then(
              function () {
                $state.go(toState, toStateParams);
              }
            );
          } else if (!User.isLoggedIn()) {
            // not logged in; redirect to login screen
            event.preventDefault();
            // save the original state destination to switch back when logged in
            pendingState = toState;
            $state.go('login');
          } else if (User.isPasswordChangeRequired()) {
            // temporary password? user needs to change it before it can proceed
            if (toState.name !== 'loginCreatePassword') {
              $state.go('loginCreatePassword');
            }
          } else if (User.isUserInitRequired()) {
            // not initialized? lets update the security questions
            if (toState.name !== 'loginUpdateSecurity') {
              $state.go('loginUpdateSecurity');
            }
          } else if (prv.isStateNotForRole(toState, isDealer) || toState.data.noDirectAccess) {
            // user is trying to access a state that's not appropriate to their role; redirect to their home
            event.preventDefault();
            // If auction user, go to /act/home. On page load, isDealer is null, but assume
            // that still means it's a dealer until API call corrects this.
            $state.go(isDealer || isDealer === null ? 'dashboard' : 'auction_dashboard');
          } else if (toState.data.isFeature) {
            if (!User.getFeatures()[toState.data.isFeature] || User.getFeatures()[toState.data.isFeature].enabled === false) {
              event.preventDefault();

              $state.go(isDealer || isDealer === null ? 'dashboard' : 'auction_dashboard');
            }
          }
        } else {
              if (savedAuth && toState.name === 'login') {
                  event.preventDefault();
                  User.initSession(savedAuth).then(
                    function () {
                      var isDealer = User.isDealer();
                      var route = isDealer ? 'dashboard' : 'auction_dashboard';
                      $state.go(route);
                    }
                  );
              }
          }
      }
    );

    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState = fromState.name;
        $rootScope.currentState = toState.name;

        var pendingFloorPlanFlag = User.getFeatures().hasOwnProperty('ribbonPendingFloorplans') ? User.getFeatures().ribbonPendingFloorplans.enabled : false;
        var openAuditsFlag = User.getFeatures().hasOwnProperty('openAudits') ? User.getFeatures().openAudits.enabled : false;


        if (toState.name === 'login' && prv.pendingReload) {
          // clobber when success going to login
          prv.pendingReload = false;
          $window.location.reload(true);
        }

        if ((toState.name === 'dashboard') && (pendingFloorPlanFlag || openAuditsFlag)) {
          $rootScope.ribbonStyle = { 'margin-bottom': '0' };
        } else {
          $rootScope.ribbonStyle = {};
        }
      }
    );

    $rootScope.$on('event:switchState', function (event, state) {
      $state.go(state);
    });

    $rootScope.$on('event:userRequestedLogout',
      function () {
        //$modal.closeAll();
        uibModal.open({
          keyboard: false,
          backdrop: 'static',
          backdropClick: false,
          templateUrl: 'client/shared/modals/confirm/confirm-logout/confirm-logout.template.html',
          controller: 'ConfirmLogoutCtrl'
        }).result.then(function (confirmed) {
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
      function () {
        // For IE9 support, must run a digest cycle after setting the cookie
        // and before reloading to make sure the cookie gets set before
        // reload. Make sure not to disrupt a currently running digest.
        if (!$rootScope.$$phase) {
          $rootScope.$digest();
        }
        prv.resetToLogin();
      }
    );

    $rootScope.$on('event:forceClearAuth',
      function () {
        User.dropSession();
        localStorageService.remove('userData')
        // save last visited state
        LastState.saveUserState();
      }
    );

    $rootScope.$on('event:userAuthenticated',
      function (d, data) {
        kissMetricInfo.getKissMetricInfo().then(
          function (result) {
            segmentio.track(metric.LOGIN_SUCCESSFUL, result);
          }
        );

        localStorageService.set('userData', data)

        if (User.isPasswordChangeRequired()) {
          // temporary password? user needs to change it before it can proceed
          $state.go('loginCreatePassword');
        } else if (User.isUserInitRequired()) {
          $state.go('loginUpdateSecurity');
        } else {
          prv.continuePostLogin();
        }
      }
    );

    $rootScope.$on('event:temporaryPasswordChanged',
      function () {
        if (User.isUserInitRequired()) {
          $state.go('loginUpdateSecurity');
        } else {
          prv.continuePostLogin();
        }
      }
    );

  }
})();
