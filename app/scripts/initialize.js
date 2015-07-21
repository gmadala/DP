(function () {

  'use strict';

  angular.module('nextgearWebApp')
    .run(initialize);

  initialize.$inject = ['$rootScope', '$location', 'User', 'segmentio', 'nxgConfig', 'LogoutGuard', '$cookieStore',
    '$state', '$dialog', 'LastState', 'api', 'metric', 'language', 'features'];

  function initialize($rootScope, $location, User, segmentio, nxgConfig, LogoutGuard, $cookieStore, $state, $dialog,
                      LastState, api, metric, language, features) {

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
      reloadPending: false,
      resetToLogin: resetToLogin,
      continuePostLoginTransition: continuePostLoginTransition,
      isStateInappropriateForRole: isStateInappropriateForRole
    };

    function resetToLogin() {
      prv.reloadPending = true;
      // set location as login page before refreshing to stop pendingState from being set
      window.location.hash = '/login';
      // clobber everything and start over at login page
      // LastState cookie modifications are asynchronous
      window.location.reload(true);
    }

    function continuePostLoginTransition() {
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

    function isStateInappropriateForRole(state, isDealer) {
      return (state.data.isAuctionState && isDealer) || (!state.data.isAuctionState && !isDealer);
    }

    // listen for route changes
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toStateParams/*, fromState, fromStateParams*/) {
        if (prv.reloadPending) {
          // prevent state change since we're reloading anyway
          event.preventDefault();
          return;
        }

        // If there are dialogs open and we aren't going to login state to popup the login "are you sure?" modal
        if ($dialog.openDialogsCount() > 0 && !(toState.name === 'login' && api.hasAuthToken())) {
          /**
           * if a dialog is open, close it before navigating to new state
           * but not for login, because the logout function already closes
           * all dialogs.
           */
          $dialog.closeAll();
        }

        if (!toState.data.allowAnonymous) {
          // enforce rules about what states certain users can see
          var isDealer = User.isDealer(),
            savedAuth = $cookieStore.get('auth');

          if (!User.isLoggedIn() && savedAuth) {
            // we're restoring session from saved auth token
            event.preventDefault();
            User.initSession(savedAuth).then(
              function () {
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
            if (toState.name !== 'loginCreatePassword') {
              $location.path('/login/createPassword');
            }
          } else if (User.isUserInitRequired()) {
            // not initialized? lets update the security questions
            if (toState.name !== 'loginUpdateSecurity') {
              $location.path('/login/updateSecurity');
            }
          } else if (prv.isStateInappropriateForRole(toState, isDealer) || toState.data.noDirectAccess) {
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

    $rootScope.$on('event:switchState', function (event, state) {
      $location.path(state.url);
    });

    $rootScope.$on('event:userRequestedLogout',
      function () {
        $dialog.closeAll();
        $dialog.dialog({
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/confirmLogout.html',
          controller: 'ConfirmLogoutCtrl'
        }).open().then(function (confirmed) {
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
        // save last visited state
        LastState.saveUserState();
      }
    );

    $rootScope.$on('event:userAuthenticated',
      function () {
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
      function () {
        if (User.isUserInitRequired()) {
          $location.path('/login/updateSecurity');
        }
        else {
          prv.continuePostLoginTransition();
        }
      }
    );
  }
})();
