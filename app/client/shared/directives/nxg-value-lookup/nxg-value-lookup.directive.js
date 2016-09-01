(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgValueLookup', nxgCreditAvailability);

  nxgCreditAvailability.$inject = ['gettext', 'gettextCatalog'];

  function nxgCreditAvailability(gettext, gettextCatalog) {

    gettext('Purchase Amount');
    gettext('Average Bookout');

    return {
      templateUrl: 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html',
      restrict: 'E',
      scope: {
        vin: '=',
        odometer: '=',
        zipCode: '=',
        requestPrice: '='
      },
      replace: 'true',
      link: linkFn
    };

    function linkFn(scope, element) {
      // var purchaseAmountText = gettextCatalog.getString('Purchase Amount');
      // var averageBookoutText = gettextCatalog.getString('Average Bookout');

      var options = {
        chart: {
          type: 'bar',
          height: 150,
          marginTop: 0,
          marginBottom: 0
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['Price', '', 'Blackbook', 'MMR', 'KBB'],
          tickLength: 0
        },
        yAxis: {
          labels: {
            enabled: false
          },
          endOnTick: false,
          title: {
            enabled: false
          },
          gridLineColor: 'transparent'
        },
        plotOptions: {
          bar: {
            groupPadding: 0,
            pointPadding: 0
          },
          series: {
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.1,
            dataLabels: {
              align: 'right',
              enabled: true,
              color: '#fff',
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
        legend: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        series: [{
          type: 'column',
          data: [{
            color: '#4CAF50',
            y: 34
          }, {
            color: 'transparent',
            y: 0
          }, {
            color: '#000000',
            y: 40
          }, {
            color: '#2196F3',
            y: 26
          }, {
            color: '#FF9800',
            y: 54
          }]
        }, {
          type: 'line',
          name: 'Highest',
          data: [50]
        }]
      };
      element.find('.nxg-value-lookup').highcharts(options);

      var chart = element.find('.nxg-value-lookup').highcharts();
      chart.renderer.path(['M', 200, 0, 'L', 200, 330])
        .attr({
          'stroke-width': 2,
          stroke: 'silver',
          dashstyle: 'dash'
        })
        .add();

      scope.$watch('vin', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update blackbook and mmr values
        if (scope.odometer) {
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
          }
        }
      });

      scope.$watch('odometer', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update blackbook and mmr values
        if (scope.vin) {
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
          }
        }
      });

      scope.$watch('zipCode', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update the kbb value only
        if (scope.vin && scope.odometer) {
        }
      });
    }
  }
})();