'use strict';

/**
 * Dependency injection definition for moment.js global function.
 *
 * This way, if you need to use it in code, you can inject it the angular
 * way instead of the old way where you reference the global object
 * (and JSHint yells at you if you don't do it explicitly).
 *
 * See 'moment' filter if you need to access moment.js formatting in a view.
 */
angular.module('nextgearWebApp')
  .factory('moment', function() {
    return window.moment;
  });
