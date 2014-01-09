'use strict';

/**
 * Watch for user logout attempts (either explicitly via Sign Out button, or implicitly e.g.
 * by hitting back button from first state after login), and hold them pending user confirmation
 */
angular.module('nextgearWebApp')
  .factory('Logout', function($rootScope, $dialog, $state, User) {

    return {
      watch: function() {
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
              $state.transitionTo(fromState);
              $dialog.closeAll();
              $dialog.dialog({
                templateUrl: 'views/modals/confirmLogout.html',
                controller: 'ConfirmLogoutCtrl'
              }).open();
            }
          }
        );
      }
    };
  })

  .controller('ConfirmLogoutCtrl', function($rootScope, $scope, dialog, User) {
    $scope.close = function(confirmed) {
      if (confirmed) {
        User.logout().then(function () {
          dialog.close(confirmed);
          $rootScope.$broadcast('event:logout');
        });
      } else {
        dialog.close(confirmed);
      }
    };
  });
