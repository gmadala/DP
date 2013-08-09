'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChart', function() {
    return {
      scope: {
        data: '=nxgChartData',
        type: '@nxgChartType',
        options: '&nxgChartOptions'
      },
      link: function(scope, element) {

        // Default settings for all charts.
        // Can be overridden by passing options via `nxg-chart-options` attribute.
        var defaults = {
          animation: false,
          segmentShowStroke: false
        };
        var options = angular.extend({}, defaults, scope.options());

        // Because the data is loaded asynchronously, we need to `$watch()`
        scope.$watch('data', function() {
          if (angular.isDefined(scope.data)) {

            // Needed for IE8. For more info, visit:
            // https://code.google.com/p/explorercanvas/wiki/Instructions#Dynamically_created_elements
            if (typeof G_vmlCanvasManager !== 'undefined') {
              G_vmlCanvasManager.initElement(element[0]);
            }

            var canvasContext = element[0].getContext('2d');
            new Chart(canvasContext)[scope.type](scope.data, options);
          }
        });
      }
    };
  });
