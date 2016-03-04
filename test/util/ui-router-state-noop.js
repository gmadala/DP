'use strict';

/**
 *
 * Karma test breaks when using the ui-router. The injection of $state in nextgearWebApp module's run function
 * causes the $state service to issue a state change when $digest is called. This eventually triggers a GET request
 * for the login.html template which most tests do not expect. This fires even if you haven't called
 * $state.transitionTo(). The workaround is to mock the $state service to prevent transitionTo from firing.
 *
 * source: https://github.com/angular-ui/ui-router/issues/212
 */
angular.module('nextgearWebApp')
  .service('$state', function() {
    return {
      transitionTo: function() { return; }
    };
  });
