'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChart', function() {
    return {
      restrict: 'A',
      scope: {
        data: '=nxgChartData',
        width: '@nxgChartWidth',
        height: '@nxgChartHeight',
        type: '@nxgChartType'
      },
      templateUrl: 'scripts/directives/nxgChart/nxgChart.html',
      replace: true,
      link: function postLink(scope, element, attrs) {

        // Because the data is loaded asynchronously, we need to `$watch()`
        scope.$watch('data', function() {
          if (angular.isDefined(scope.data)) {
            var canvasContext = element.find('.chart')[0].getContext('2d');
            new Chart(canvasContext)[scope.type](scope.data, {segmentShowStroke: false});
          }
        });
        
      }
    };
  });
