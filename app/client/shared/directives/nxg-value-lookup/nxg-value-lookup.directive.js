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
          marginRight: 0,
          marginBottom: 50
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
              left: '-105px'
            }
          }, {
            html: '<strong>' + bookoutAmountText + '</strong>',
            style: {
              top: '55px',
              left: '-105px'
            }
          }]
        },
        xAxis: {
          categories: ['', 'From Bill of Sale', '', 'Black Book', 'MMR', 'KBB®'],
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
              formatter: function() {
                return numeral(this.y).format('$0,0[.]00');
              }
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

      function realignLabels(series) {
        var chart = series.chart;
        _.each(series.data, function(point) {
          if (!point.dataLabel || !point.y) {
            return true;
          }

          var color = '#FFF';
          var position = point.dataLabel.x;
          if (chart.plotWidth - point.plotY < point.dataLabel.width) {
            position = position + 30;
            // default font color is white, if it's outside the bar then change it to black.
            color = '#000';
          }

          point.dataLabel
            .attr({
              x: position
            })
            .css({
              color: color
            });
        });
      }

      function updateMmrAndBlackbookValuation() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        $q.all([
          Blackbook.lookupByVin(scope.vin, scope.odometer, true),
          Mmr.lookupByVin(scope.vin, scope.odometer)
        ]).then(function(results) {
          var minimumBlackbookAverage = _.min(results[0], function(element) {
            return element.AverageValue;
          });

          var minimumMmrAverage = _.min(results[1], function(element) {
            return element.AverageWholesale;
          });

          var data = chart.series[0].data;
          data[3].y = minimumBlackbookAverage ? minimumBlackbookAverage.AverageValue : 0;
          data[4].y = minimumMmrAverage ? minimumMmrAverage.AverageWholesale : 0;
          chart.series[0].setData(data);
          realignLabels(chart.series[0]);
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
            var minimumKbbAverage = _.min(kbbResults, function(element) {
              return element.Good;
            });

            // calculate the average of the averages
            var data = chart.series[0].data;
            data[5].y = minimumKbbAverage ? minimumKbbAverage.Good : 0;
            chart.series[0].setData(data);
            realignLabels(chart.series[0]);
          });
      }

      var valuationLabel, valuationTriangle;

      scope.$watch('purchasePrice', function(newValue, oldValue) {
        if (oldValue === newValue) {
          return;
        }

        var chart = element.find('.nxg-value-lookup').highcharts();
        // calculate the average of the averages
        var data = chart.series[0].data;
        data[1].y = newValue;
        chart.series[0].setData(data);
        realignLabels(chart.series[0]);
        if (newValue) {

          var projectedPoint = _.max([data[3], data[4], data[5]], function(element) {
            return element.y;
          });

          projectedPoint = _.min([projectedPoint, data[1]], function(element) {
            return element.y;
          });

          chart.yAxis[0].removePlotLine('max-plot-line');
          chart.yAxis[0].addPlotLine({
            value: projectedPoint.y,
            color: 'black',
            width: 1,
            id: 'max-plot-line'
          });

          if (valuationLabel) {
            valuationLabel.destroy();
            valuationTriangle.destroy();
          }

          var labelX = chart.plotLeft;
          var labelY = chart.plotTop + chart.chartHeight - 45;
          var labelText = projectedPoint.category === 'From Bill of Sale' ? purchasePriceLessText : purchasePriceMoreText;

          var percentage = (chart.plotWidth - projectedPoint.plotY) * 100 / chart.plotWidth;
          if (percentage > 70) {
            labelX = labelX + 120;
          } else if (percentage > 30 && percentage <= 70) {
            labelX = labelX + 60;
          } else {
            labelX = labelX - 5;
          }

          valuationLabel = chart.renderer
            .label(
              labelText,
              labelX,
              labelY,
              'square'
            )
            .css({
              color: '#000',
              fontSize: '10px'
            })
            .attr({
              paddingTop: 10,
              zIndex: 6
            })
            .add();


          valuationTriangle =
            chart.renderer
              .path(
                ['M', chart.plotLeft + chart.plotWidth - projectedPoint.plotY, labelY,
                  'L', chart.plotLeft + chart.plotWidth - projectedPoint.plotY + 5, labelY + 5,
                  'L', chart.plotLeft + chart.plotWidth - projectedPoint.plotY - 5, labelY + 5,
                  'L', chart.plotLeft + chart.plotWidth - projectedPoint.plotY, labelY])
              .attr({
                fill: 'rgba(0, 0, 0, 0.75)',
                zIndex: 6
              })
              .add();
        }

      });

      scope.$watch('vin', function(newValue, oldValue) {

        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }
        // update blackbook and mmr values
        if (scope.odometer && newValue) {
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
        if (scope.vin && newValue) {
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
          var selectedLocation = locations.find(function(location) {
            return location.AddressId === newValue.AddressId;
          });
          scope.zipCode = selectedLocation.Zip;
          updateKbbValuation();
        }
      });
    }
  }
})();