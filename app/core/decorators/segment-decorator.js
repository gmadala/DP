(function () {

  'use strict';

  angular.module('nextgearWebApp')
    .config(segmentConfig);

  segmentConfig.$inject = ['$provide'];

  function segmentConfig($provide) {
    $provide.decorator('segmentio', segmentDecorator);
  }

  segmentDecorator.$inject = ['$delegate', '$window'];

  function segmentDecorator($delegate, $window) {
    /* jshint unused: false */
    var additionalInfo = {
      height: $window.screen.height,
      width: $window.screen.width,
      availTop: $window.screen.availTop,
      availLeft: $window.screen.availLeft,
      availHeight: $window.screen.availHeight,
      availWidth: $window.screen.availWidth,
      userAgent: $window.navigator.userAgent
    };
    return $delegate;
  }

})();