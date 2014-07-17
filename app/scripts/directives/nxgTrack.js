'use strict';

angular.module('nextgearWebApp')
  .directive('nxgTrack', function(segmentio) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function(){
          var trackEvent = attrs.nxgTrack;
          if(trackEvent){
            var properties;
            if (attrs.trackProperties) {
              properties = scope.$eval(attrs.trackProperties);
            }
            segmentio.track(trackEvent, properties);
          }
        });
      }
    };
  });
