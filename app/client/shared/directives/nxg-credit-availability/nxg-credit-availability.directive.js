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

      // search for the data from server
      scope.lineOfCredits = {};
      // search range 7 days.
      var startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
      var endDate = moment().format('YYYY-MM-DD');
      api.request('GET', '/dealer/buyer/dashboard/' + startDate + '/' + endDate)
        .then(function(data) {
          var totalLimit = 0;
          var totalAvailable = 0;
          data.LinesOfCredit.forEach(function(lineOfCredit) {
            totalLimit = totalLimit + lineOfCredit.LineOfCreditAmount;
            totalAvailable = totalAvailable + lineOfCredit.AvailableCreditAmount;

            scope.lineOfCredits[lineOfCredit.LineOfCreditId] = {
              name: lineOfCredit.CreditTypeName,
              total: lineOfCredit.LineOfCreditAmount,
              available: lineOfCredit.AvailableCreditAmount
            };
          });

          scope.lineOfCredits['TOTAL_LOC'] = {
            name: 'Total',
            total: totalLimit,
            available: totalAvailable
          };

          // default to total for the initial view
          scope.creditTypeName = 'Total';
          scope.creditLimit = numeral(totalLimit).format('($0.00a)');

          var chartElement = element.find('.nxg-credit-availability').highcharts();
          chartElement.series[0].setData([{
            y: totalAvailable,
            color: "#4CAF50",
            dataLabels: {
              align: 'right'
            }
          }]);
          chartElement.series[1].setData([{
            y: totalLimit - totalAvailable,
            color: "#9E9E9E",
            dataLabels: {
              align: 'left'
            }
          }]);
        });

      scope.$watch('creditType', function(newValue) {
        var key = 'TOTAL_LOC';
        if (newValue) {
          key = newValue.LineOfCreditId;
        }

        var lineOfCredit = scope.lineOfCredits[key];
        if (lineOfCredit) {
          scope.creditTypeName = lineOfCredit.name;
          scope.creditLimit = numeral(lineOfCredit.total).format('($0.00a)');

          var chartElement = element.find('.nxg-credit-availability').highcharts();
          chartElement.series[0].setData([{
            y: lineOfCredit.available,
            color: "#4CAF50",
            dataLabels: {
              align: 'right'
            }
          }]);
          chartElement.series[1].setData([{
            y: lineOfCredit.total - lineOfCredit.available,
            color: "#9E9E9E",
            dataLabels: {
              align: 'left'
            }
          }]);
        }

      })
    }
  }

})();