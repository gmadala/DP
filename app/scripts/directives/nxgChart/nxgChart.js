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
        size: '=nxgChartSize',
        options: '&nxgChartOptions', // any overall options.
        truncateLabels: '@nxgChartTrimLabels', // true or false
        showLegend: '=nxgShowLegend', // true or false
        donutOptions: '=nxgDonutOptions', // options specific to donut charts
        title: '=nxgChartTitle' // title object that highcharts accepts

      },
      link: function(scope, element) {
        var defaultFontFamily = 'Helvetica, Arial, sans-serif';
        // initialize chart with defaults and passed options
        var initializeChart = function(){
          var options = {
            chart: {
              type: scope.type,
              backgroundColor: 'transparent',
              style: {
                fontFamily: defaultFontFamily
              },
            },
            title: {
              text:'',
              floating: false, //whether label will affect chart position or not; default is false
              style: {
                fontFamily: defaultFontFamily,
                fontSize: '14px',
                fontWeight: 'bold'
              },
              y: 15 // vertical position of title within chart; default is 15
            },
            credits: { enabled: false },
            tooltip: {
              enabled: scope.tooltip !== 'false' ? true : false,
              backgroundColor: 'rgba(255,255,255,1)',
              borderColor: '#ccc',
              borderRadius: 0,
              headerFormat: '<span>{point.key}</span><br/>',
              shadow: false,
              style: {
                fontFamily: defaultFontFamily,
                fontSize: '12px'
              }
            },
            labels: {
              style: {
                fontFamily: defaultFontFamily
              }
            },
            legend: {
              borderWidth: 0,
              enabled: scope.showLegend || false,
              floating: true,
              labelFormatter: function() { // formats label to two lines; adds '$', decimal, comma, etc.
                return '<div class="chart-legend">' + this.name + ' – <b>$' + Highcharts.numberFormat(this.y, 2) + '</b></div>';
              },
              itemStyle: {
                fontFamily: defaultFontFamily,
              },
              itemHoverStyle: {
                color: '#274B6D' // same as non-hover color
              },
              itemMarginTop: 2,
              itemMarginBottom: 2,
              layout: 'vertical',
              margin: 0,
              symbolRadius: 0,
              symbolWidth: 20,
              useHTML: true,
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
                size: (scope.donutOptions && scope.donutOptions.size) || '100%',
                innerSize: (scope.donutOptions && scope.donutOptions.innerSize) || '87%',
                startAngle: (scope.donutOptions && scope.donutOptions.semiCircle) ? -90 : 0,
                endAngle: (scope.donutOptions && scope.donutOptions.semiCircle) ? 90 : null,
                dataLabels: {
                  enabled: false
                },
                showInLegend: scope.showLegend || false,
                center: ['50%','50%'],
                point: {
                  events: {
                    legendItemClick: function() {
                      return false;
                    }
                  }
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
                  fontFamily: defaultFontFamily,
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
                  fontFamily: defaultFontFamily,
                  color: '#135889'
                }
              },
              labels: {
                style: {
                  fontFamily: defaultFontFamily,
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
          }

          if (scope.size) {
            options.chart.width = scope.size.width;
            options.chart.height = scope.size.height;
          }

          // set donut options if any have been passed in
          if (scope.donutOptions) {
            var pie = options.plotOptions.pie;
            pie.borderWidth = scope.donutOptions.border ? 1 : options.plotOptions.pie.borderWidth;
            pie.borderColor = scope.donutOptions.borderColor ? scope.donutOptions.borderColor: '#FFFFFF';
            pie.size = scope.donutOptions.size ? scope.donutOptions.size : options.plotOptions.pie.size;
            pie.innerSize = scope.donutOptions.innerSize ? scope.donutOptions.innerSize : options.plotOptions.pie.innerSize;
          }

          // set title options if any have been passed in.
          if (scope.title) {
            options.title.text = (scope.title.text) ? scope.title.text : options.title.text;
            options.title.floating = (scope.title.floating) ? scope.title.floating : options.title.floating;
            if (scope.title.style) {
              options.title.style.fontSize = (scope.title.style.fontSize) ? scope.title.style.fontSize : options.title.style.fontSize;
              options.title.style.fontWeight = (scope.title.style.fontWeight) ? scope.title.style.fontWeight : options.title.style.fontWeight;
            }
            options.title.y = (scope.title.y) ? scope.title.y : options.title.y;
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
                // If categories are enabled, trim to 20 characters to keep them visible on the chart
                element.highcharts().xAxis[0].setCategories(_.map(scope.data, function(item){
                  if(item[0].length > 20 && scope.truncateLabels){
                    // cuts string to 20 characters including ellipsis, & no space before ellipsis
                    return item[0].substr(0,20-3).trim()+"...";
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
