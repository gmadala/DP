(function() {
  'use strict';

  /**
   * The sole purpose of this service is to provide a "secret"
   * value (in this case, just an empty object).
   *
   * This can be used to publish a method on a scope that
   * can be called by unit tests and by other methods defined
   * in the same controller, but not by views, as long as the
   * secret object is not published on the scope.
   */

  angular
    .module('nextgearWebApp')
    .factory('protect', function() {
      return {};
    });

})();
