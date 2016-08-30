(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgCreditAvailability', nxgCreditAvailability);

  nxgCreditAvailability.$inject = ['api'];

  function nxgCreditAvailability(api) {

    return {
      templateUrl: 'client/shared/directives/nxg-credit-availability/nxg-credit-availability.template.html',
      restrict: 'E',
      scope: {
        creditType: '='
      },
      replace: 'true',
      link: link
    };

    function link(scope, element) {
      var options = {
        chart: {
          type: 'bar',
          height: 30,
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0]
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          bar: {
            groupPadding: 0,
            pointPadding: 0
          },
          series: {
            stacking: 'percent',
            dataLabels: {
              enabled: true,
              color: '#fff',
              style: {
                fontWeight: 'bolder'
              },
              formatter: function() {
                return numeral(this.y).format('($0.00a)');
              },
              inside: true
            },
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        title: {
          text: ''
        },
        tooltip: {
          enabled: false
        },
        xAxis: {
          labels: {
            enabled: false
          },
          title: {
            enabled: false
          },
          lineColor: 'transparent',
          lineWidth: 0,
          minorGridLineWidth: 0,
          minorTickLength: 0,
          tickLength: 0,
          visible: false
        },
        yAxis: {
          labels: {
            enabled: false
          },
          title: {
            enabled: false
          },
          lineColor: 'transparent',
          lineWidth: 0,
          minorGridLineWidth: 0,
          minorTickLength: 0,
          tickLength: 0,
          visible: false
        },
        series: [{
          name: 'Available',
          data: [{
            y: 0,
            color: "#4CAF50",
            dataLabels: {
              align: 'right'
            }
          }]
        }, {
          name: 'Used',
          data: [{
            y: 0,
            color: "#9E9E9E",
            dataLabels: {
              align: 'left'
            }
          }]
        }]
      };
      element.find('.nxg-credit-availability').highcharts(options);

      function updateCharts(name, total, available) {
        scope.creditTypeName = name;
        scope.creditLimit = numeral(total).format('($0.00a)');

        var chartElement = element.find('.nxg-credit-availability').highcharts();
        chartElement.series[0].setData([{
          y: available,
          color: "#4CAF50",
          dataLabels: {
            align: 'right'
          }
        }]);
        chartElement.series[1].setData([{
          y: total - available,
          color: "#9E9E9E",
          dataLabels: {
            align: 'left'
          }
        }]);
      }

      function updateChartData() {
        var totalLimit = 0;
        var totalAvailable = 0;

        // search for the data from server
        scope.lineOfCredits = {};

        // search range 7 days.
        var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        var endDate = moment().format('YYYY-MM-DD');
        api.request('GET', '/dealer/buyer/dashboard/' + startDate + '/' + endDate)
          .then(function(data) {
            // process the lines of credits to credit object with:
            // 'total.LineOfCredits --> totalLimit, totalAvailable
            // 'locId1' --> name1, total1, available1
            // 'locId2' --> name2, total2, available2
            // ....
            data.LinesOfCredit.forEach(function(lineOfCredit) {
              totalLimit = totalLimit + lineOfCredit.LineOfCreditAmount;
              totalAvailable = totalAvailable + lineOfCredit.AvailableCreditAmount;

              scope.lineOfCredits[lineOfCredit.LineOfCreditId] = {
                name: lineOfCredit.CreditTypeName,
                total: lineOfCredit.LineOfCreditAmount,
                available: lineOfCredit.AvailableCreditAmount
              };
            });

            scope.lineOfCredits['total.lineOfCredits'] = {
              name: 'Total',
              total: totalLimit,
              available: totalAvailable
            };
          })
          .then(function() {
            // default to total for the initial view
            updateCharts('Total', totalLimit, totalAvailable);
          });
      }

      scope.$watch('creditType', function(newValue) {
        if (!newValue) {
          updateChartData();
        } else {
          var lineOfCredit = scope.lineOfCredits[newValue.LineOfCreditId];
          if (lineOfCredit) {
            updateCharts(lineOfCredit.name, lineOfCredit.total, lineOfCredit.available);
          }
        }
      });
    }
  }

})();