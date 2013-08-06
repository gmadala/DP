'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChart', function() {
    return {
      scope: {
        data: '=nxgChartData',
        type: '@nxgChartType',
        options: '&nxgChartOptions'
      },
      link: function(scope, element, attrs) {

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
            var canvasContext = element[0].getContext('2d');
            new Chart(canvasContext)[scope.type](scope.data, options);
          }
        });
      }
    };
  });
