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
        // initialize chart with defaults and passed options
        var initializeChart = function(){
          var options = {
            legend: { enabled: false },
            chart:  {
              type   : scope.type,
              backgroundColor: 'transparent',
              style: {
                fontFamily: 'Helvetica, Arial, sans-serif'
              }
            },
            title:  { text   : ''    },
            credits: { enabled: false },
            tooltip: {
              enabled: scope.tooltip !== 'false' ? true : false,
              backgroundColor: 'rgba(255,255,255,1)',
              borderColor: '#ccc',
              borderRadius: 0,
              headerFormat: '<span>{point.key}</span><br/>',
              shadow: false,
              style: {
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '12px'
              }
            },
            labels: {
              style: {
                fontFamily: 'Helvetica, Arial, sans-serif'
              }
            },
            plotOptions: {
              bar: {
                pointWidth: 28,
                pointPadding: 0
              },
              line: {
                color: '#009EFF',
                pointWidth: 45
              },
              pie: {
                dataLabels: {
                  enabled: false
                },
                borderWidth: 0
              }
            },
            xAxis: {
              lineColor: '#ccc',
              lineWidth: 1,
              tickWidth: 0,
              labels: {
                enabled: scope.labels && scope.labels === 'true',
                aligned: 'right',
                style: {
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontSize: '12px'
                }
              }
            },
            yAxis: {
              lineColor: '#ccc',
              lineWidth: 1,
              tickWidth: 1,
              gridLineColor: '#eee',
              title: {
                text: scope.descriptionX || '',
                style: {
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#135889'
                }
              },
              labels: {
                style: {
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontSize: '12px'
                }
              }
            },
            series: [{
              color: '#009EFF',
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

          if(scope.type === 'line') {
            options.xAxis.type = 'category';
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
              var dataMin = _.min(scope.data, function(point){
                  return point[1];
                })[1];
              element.highcharts().yAxis[0].update({
                // only subtract 5 if it won't give us a negative value
                min: (dataMin >= 5) ? dataMin - 5 : dataMin,
                max: _.max(scope.data, function(point){
                  return point[1];
                })[1] + 5
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
