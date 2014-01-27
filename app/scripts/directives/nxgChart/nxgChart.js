'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChart', function() {
    return {
      scope: {
        data: '=nxgChartData',
        type: '@nxgChartType', // 'bar' or 'line' or 'pie'
        labels: '@nxgChartLabels', // Array of labels on independent axis
        descriptionX: '@nxgChartDescriptionX', // dependent axis legend text
        dataName: '@nxgChartDataName', // Text next to value on tooltip
        tooltip: '@nxgChartTooltip', // true or false
        size: '@nxgChartSize',
        innerSize: '@nxgChartInnerSize',
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
          var options = {
            legend: { enabled: false },
            chart:  { type   : scope.type, backgroundColor: 'transparent', spacing: [0,0,0,0] },
            title:  { text   : ''    },
            credits:{ enabled: false },
            tooltip: {
              enabled: scope.tooltip !== 'false' ? true : false
            },
            plotOptions: {
              bar: {
                pointWidth: 26 // Played around, this was best value for bar width
              },
              pie: {
                dataLabels: {
                  enabled: false
                },
                borderWidth: 0
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
              name: 'Value',
              states: {hover: {}}
            }]
          };

          if(scope.type === 'pie'){
            options.series[0].states.hover.enabled = false;
            if(scope.size && scope.size.indexOf('%') === -1){
              options.series[0].size = parseInt(scope.size);
              options.series[0].innerSize = parseInt(scope.innerSize);
            }else{
              options.series[0].size = scope.size || '115%';
              options.series[0].innerSize = scope.innerSize || '87%';
            }
          }

          element.highcharts(options);
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
                // TODO Change this - the max length depends on width of chart.
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
