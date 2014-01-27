'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChart', function() {
    return {
      scope: {
        data: '=nxgChartData',
        type: '@nxgChartType', // 'bar' or 'line'
        labels: '@nxgChartLabels', // Array of labels on independent axis
        descriptionX: '@nxgChartDescriptionX', // dependent axis legend text
        dataName: '@nxgChartDataName', // Text next to value on tooltip
        options: '&nxgChartOptions'
      },
      link: function(scope, element) {
        if(element[0].tagName === 'CANVAS') return;


        // Default settings for all charts.
        // Can be overridden by passing options via `nxg-chart-options` attribute.
        var defaults = {
          animation: false,
          segmentShowStroke: false
        };
        var options = angular.extend({}, defaults, scope.options());

        var initializeChart = function(){
          element.highcharts({
            legend: { enabled: false },
            chart:  { type   : scope.type  },
            title:  { text   : ''    },
            plotOptions: {
              bar: {
                pointWidth: 26 // Played around, this was best value for bar width
              }
            },
            xAxis: {
              labels: {
                enabled: scope.labels && scope.labels === 'true',
                aligned: 'right'
              }
            },
            yAxis: {
              gridLineColor: '#eee',
              title: {text: scope.descriptionX || ''},
            },
            series: [{
              color: '#009eff',
              name: 'Value'
            }]

          });
          initializeChart.initialized = true;
        };

        // Because the data is loaded asynchronously, we need to `$watch()`
        scope.$watch('data', function() {
          if (angular.isDefined(scope.data)) {
            if(!initializeChart.initialized){
              initializeChart();
            }

            if(initializeChart.initialized){
              element.highcharts().yAxis[0].update({
                min: _.min(scope.data, function(point){
                  return point[1];
                })[1]-5,
                max: _.max(scope.data, function(point){
                  return point[1];
                })[1]+5
              });

              element.highcharts().series[0].setData(scope.data);
              element.highcharts().series[0].name = scope.dataName || 'Value'; // For tooltip
              if(scope.labels && scope.labels === 'true'){
                // If categories are enabled, trim to 29 characters to keep them visible on the chart
                element.highcharts().xAxis[0].setCategories(_.map(scope.data, function(item){
                  if(item[0].length > 29){
                    return item[0].substr(0,29-3)+"...";
                  }else{
                    return item[0];
                  }
                }));
              }
            }
          }
        });
      }
    };
  });
