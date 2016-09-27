(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgCreditAvailability', nxgCreditAvailability);

  nxgCreditAvailability.$inject = ['api', 'gettext', 'gettextCatalog'];

  function nxgCreditAvailability(api, gettext, gettextCatalog) {

    gettext('Used');
    gettext('Available');

    return {
      templateUrl: 'client/shared/directives/nxg-credit-availability/nxg-credit-availability.template.html',
      restrict: 'E',
      scope: {
        creditType: '=',
        purchasePrice: '='
      },
      replace: 'true',
      link: link
    };

    function link(scope, element) {
      scope.insufficientCredit = false;

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
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              color: '#FFF',
              style: {
                fontWeight: 'bolder'
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
          name: 'Available'
        }, {
          name: 'Used'
        }]
      };
      element.find('.nxg-credit-availability').highcharts(options);

      function updateCharts(name, total, available) {
        scope.creditTypeName = name;
        scope.creditLimit = numeral(total).format('($0.0a)');
        var usedLine = '<span>' + gettextCatalog.getString('Used') + ': ' + numeral(total - available).format('($0,0.00)') + '</span><br />';
        var availableLine = '<span>' + gettextCatalog.getString('Available') + ': ' + numeral(available).format('($0,0.00)') + '</span>';
        scope.availabilityTooltip = usedLine + availableLine;

        var chartElement = element.find('.nxg-credit-availability').highcharts();
        chartElement.series[0].setData([{
          y: available > 0 ? available : 0,
          color: "#4CAF50",
          dataLabels: {
            align: 'right',
            formatter: function() {
              return numeral(available).format('($0.0a)', Math.floor);
            }
          }
        }]);
        chartElement.series[1].setData([{
          y: total - available,
          color: "#9E9E9E",
          dataLabels: {
            align: 'left',
            formatter: function() {
              return numeral(total - available).format('($0.0a)', Math.ceil);
            }
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
              totalAvailable = totalAvailable + lineOfCredit.AvailableCreditAmount;

              var totalLineOfCredit = lineOfCredit.LineOfCreditAmount;
              if (moment(lineOfCredit.TempLineOfCreditExpiration).isSame(moment()) ||
                moment(lineOfCredit.TempLineOfCreditExpiration).isAfter(moment())) {
                totalLineOfCredit = totalLineOfCredit + lineOfCredit.TempLineOfCreditAmount;
              }
              totalLimit = totalLimit + totalLineOfCredit;

              scope.lineOfCredits[lineOfCredit.LineOfCreditId] = {
                name: lineOfCredit.CreditTypeName,
                total: totalLineOfCredit,
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
            var lineOfCredit = scope.lineOfCredits['total.lineOfCredits'];
            if (scope.creditType) {
              lineOfCredit = scope.lineOfCredits[scope.creditType.LineOfCreditId];
            }
            updateCharts(lineOfCredit.name, lineOfCredit.total, lineOfCredit.available);
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

      scope.$watch('purchasePrice', function(newValue, oldValue) {
        if (oldValue === newValue || !scope.creditType || !newValue) {
          return;
        }

        var lineOfCredit = scope.lineOfCredits[scope.creditType.LineOfCreditId];

        var chart = element.find('.nxg-credit-availability').highcharts();
        var data = chart.series[0].data;
        if (lineOfCredit.available <= newValue) {
          scope.insufficientCredit = true;
          data[0].color = '#D32F2F';
        } else {
          scope.insufficientCredit = false;
          data[0].color = '#4CAF50';
        }
        chart.series[0].setData(data);

      });
    }
  }

})();