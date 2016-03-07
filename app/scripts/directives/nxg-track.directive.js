'use strict';

angular.module('nextgearWebApp')
  .directive('nxgTrack', function(segmentio, kissMetricInfo) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function(){
          var trackEvent = attrs.nxgTrack;
          if(trackEvent){
            kissMetricInfo.getKissMetricInfo().then(function (kissProperties) {
              var properties = kissProperties;
              if (attrs.trackProperties) {
                properties = angular.extend(properties, scope.$eval(attrs.trackProperties));
              }
              segmentio.track(trackEvent, properties);
            });
          }
        });
      }
    };
  });
