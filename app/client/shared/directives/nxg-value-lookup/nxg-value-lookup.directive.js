(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgValueLookup', nxgValueLookup);

  nxgValueLookup.$inject = ['$q', 'Addresses', 'gettext', 'gettextCatalog', 'Kbb', 'Mmr', 'Blackbook'];

  function nxgValueLookup($q, Addresses, gettext, gettextCatalog, Kbb, Mmr, Blackbook) {

    gettext('Purchase Amount');
    gettext('Average Bookout');
    gettext('Purchase price less than <br /> highest average bookout');
    gettext('Purchase price more than <br /> highest average bookout');

    return {
      templateUrl: 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html',
      restrict: 'E',
      scope: {
        vin: '=',
        odometer: '=',
        inventoryLocation: '=',
        purchasePrice: '=',
        fullPrice: '='
      },
      replace: 'true',
      link: linkFn
    };

    function linkFn(scope, element) {
      // local vars for translation and lookup
      var locations = Addresses.getActivePhysical();
      var purchasePriceText = gettextCatalog.getString('Purchase Price');
      var bookoutAmountText = gettextCatalog.getString('Bookout Amount');
      var purchasePriceLessText = gettextCatalog.getString('Purchase price less than <br /> highest average bookout');
      var purchasePriceMoreText = gettextCatalog.getString('Purchase price more than <br /> highest average bookout');

      // init the options for the chart
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
            html: '<strong>' + purchasePriceText + '</strong>',
            style: {
              top: '5px',
              left: '-106px'
            }
          }, {
            html: '<strong>' + bookoutAmountText + '</strong>',
            style: {
              top: '55px',
              left: '-106px'
            }
          }, {
            html: '',
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
          endOnTick: false
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
            y: 0
          }, {
            color: 'black',
            y: 0
          }, {
            color: '#000000',
            y: 0
          }, {
            color: '#FF9800',
            y: 0
          }, {
            color: '#2196F3',
            y: 0
          }]
        }]
      };
      element.find('.nxg-value-lookup').highcharts(options);

      // stuff in the scope object and watchers
      scope.zipCode = null;
      // if there's only one address default the zip to that one
      if (locations.length === 1) {
        scope.zipCode = locations[0].Zip;
      }

      function updateMmrAndBlackbookValuation() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        $q.all([
          Blackbook.lookupByVin(scope.vin, scope.odometer, true),
          Mmr.lookupByVin(scope.vin, scope.odometer)
        ]).then(function(results) {
          console.log(results);

          var blackbookAverage = 0;
          results[0].forEach(function(blackbookResult) {
            blackbookAverage = blackbookAverage + blackbookResult.AverageValue;
          });
          blackbookAverage = blackbookAverage / results[0].length;

          var mmrAverage = 0;
          results[1].forEach(function(mmrResult) {
            mmrAverage = mmrAverage + mmrResult.AverageWholesale;
          });
          mmrAverage = mmrAverage / results[1].length;

          var data = chart.series[0].data;
          data[3].y = blackbookAverage;
          data[4].y = mmrAverage;
          chart.series[0].setData(data);
        });
      }

      function updateKbbValuation() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        Kbb.getConfigurations(scope.vin, scope.zipCode)
          .then(function(configurations) {
            var kbbLookups = [];
            configurations.forEach(function(configuration) {
              var kbbLookup = Kbb.lookupByConfiguration(configuration, scope.odometer, scope.zipCode);
              kbbLookups.push(kbbLookup);
            });
            return $q.all(kbbLookups);
          })
          .then(function(kbbResults) {
            var kbbAverage = 0;
            kbbResults.forEach(function(kbbResult) {
              kbbAverage = kbbAverage + kbbResult.Good;
            });
            kbbAverage = kbbAverage / kbbResults.length;

            // calculate the average of the averages
            var data = chart.series[0].data;
            data[5].y = kbbAverage;
            chart.series[0].setData(data);
          });
      }

      scope.$watch('purchasePrice', function(newValue, oldValue) {
        if (oldValue === newValue) {
          return;
        }

        var chart = element.find('.nxg-value-lookup').highcharts();
        // calculate the average of the averages
        var data = chart.series[0].data;
        data[1].y = newValue;
        chart.series[0].setData(data);
      });

      scope.$watch('vin', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }
        // update blackbook and mmr values
        if (scope.odometer) {
          updateMmrAndBlackbookValuation();
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
            updateKbbValuation();
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
          updateMmrAndBlackbookValuation();
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
            updateKbbValuation();
          }
        }
      });

      scope.$watch('inventoryLocation', function(newValue, oldValue) {
        // skip doing anything when the value is not changing or there's only one address
        if (oldValue === newValue || locations.length === 1) {
          return;
        }

        // update the kbb value only
        if (scope.vin && scope.odometer) {
          var selectedLocation = locations.filter(function(location) {
            return location.AddressId === newValue;
          });
          scope.zipCode = selectedLocation.Zip;
          updateKbbValuation();
        }
      });
    }
  }
})();