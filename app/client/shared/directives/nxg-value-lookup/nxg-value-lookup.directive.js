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

      var options = {
        chart: {
          backgroundColor: null,
          type: 'bar',
          height: 200,
          marginTop: 0,
          marginBottom: 50,
          spacingLeft: 40
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        labels: {
          items: [{
            html: '<strong>' + gettextCatalog.getString('Purchase Price') + '</strong>',
            style: {
              top: '5px',
              left: '-106px'
            }
          }, {
            html: '<strong>' + gettextCatalog.getString('Bookout Amount') + '</strong>',
            style: {
              top: '55px',
              left: '-106px'
            }
          }, {
            html: 'Purchase price less than <br /> highest average bookout',
            style: {
              top: '160px',
              left: '135px',
              fontSize: '10px'
            }
          }]
        },
        xAxis: {
          categories: ['', 'Total Cost', '', 'Black Book', 'MMR', 'KBB®'],
          tickLength: 0,
          gridLineColor: 'transparent',
          lineWidth: 0,
          minorGridLineWidth: 0,
          minorTickLength: 0
        },
        yAxis: {
          labels: {
            enabled: false
          },
          title: {
            enabled: false
          },
          gridLineColor: 'transparent',
          endOnTick: false,
          plotLines: [{
            color: 'gray',
            width: 2,
            value: 8700,
            dashStyle: 'solid'
          }]
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
        legend: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        series: [{
          type: 'column',
          data: [{
            color: 'black',
            y: 0
          }, {
            color: '#4CAF50',
            y: 10000
          }, {
            color: 'black',
            y: 0
          }, {
            color: '#000000',
            y: 8700
          }, {
            color: '#2196F3',
            y: 8650
          }, {
            color: '#FF9800',
            y: 8400
          }]
        }]
      };
      element.find('.nxg-value-lookup').highcharts(options);

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