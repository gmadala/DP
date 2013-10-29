'use strict';
/**
 * Angular segmentio from https://github.com/arnaudbreton/angular-segmentio with custom modifications
 * by Ryan Bell, EffectiveUI.
 *
 * - Removed internal $viewContentLoaded = pageview assumption, as that seems to result in a lot of noise
 * - Fix jshint error
 */
angular.module('segmentio', ['ng'])
  .factory('segmentio', ['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log) {
    var service = {};

    $window.analytics = $window.analytics || [];

    // Define a factory that generates wrapper methods to push arrays of
    // arguments onto our `analytics` queue, where the first element of the arrays
    // is always the name of the analytics.js method itself (eg. `track`).
    var methodFactory = function (type) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if($window.analytics.initialized) {
          $window.analytics[type].apply($window.analytics, args);
        }
        else {
          $window.analytics.push([type].concat(args));
        }
      };
    };

    // Loop through analytics.js' methods and generate a wrapper method for each.
    var methods = ['identify', 'track', 'trackLink', 'trackForm', 'trackClick',
      'trackSubmit', 'pageview', 'ab', 'alias', 'ready', 'group'];
    for (var i = 0; i < methods.length; i++) {
      service[methods[i]] = methodFactory(methods[i]);
    }

    /**
     * @description
     * Load Segment.io analytics script
     * @param apiKey The key API to use
     */
    service.load = function(apiKey) {
      // Create an async script element for analytics.js.
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = ('https:' === document.location.protocol ? 'https://' : 'http://') +
        'd2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/' + apiKey + '/analytics.js';

      // Find the first script element on the page and insert our script next to it.
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    return service;
  }]);
