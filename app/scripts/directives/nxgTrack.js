'use strict';

angular.module('nextgearWebApp')
  .directive('nxgTrack', function (segmentio) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (element[0].tagName && element[0].tagName.toLowerCase() === 'a') {
          attrs.$observe('nxgTrack', function (value) {
            if (value) {
              var properties;
              if (attrs.trackProperties) {
                properties = scope.$eval(attrs.trackProperties);
              }
              segmentio.trackLink(element, value, properties);
            }
          });
        }
      }
    };
  });
