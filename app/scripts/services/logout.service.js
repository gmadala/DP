(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('LogoutGuard', LogoutGuard);

  LogoutGuard.$inject = ['$rootScope', 'User'];

  function LogoutGuard($rootScope, User) {

    return {
      /**
       * Watch for implicit user logout attempts (e.g. by hitting back button from first state after login)
       * and convert them into a proper logout command that we can handle
       */
      watchForLogoutAttemptByURLState: function() {
        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState) {
            if (toState.name === 'login' && User.isLoggedIn()) {
              event.preventDefault();
              /**
               * By the time we get here the URL has already changed.  Yes, we can prevent the state change
               * but URL would show #/login, which is not right. We can reset it by switching back to the current state
               * but you can still see the URL change briefly. This is as best we can do with Angular v1.0.8.
               * Newer versions of Angular provide with better ways to address this.
               */
              $rootScope.$broadcast('event:switchState', fromState);
              $rootScope.$emit('event:userRequestedLogout');
            }
          }
        );
      }
    };

  }
})();
