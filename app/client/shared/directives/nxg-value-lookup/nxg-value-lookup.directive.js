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
        additionalFinancing: '='
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
          marginBottom: 50,
          marginLeft: 80
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
              left: '-80px'
            }
          }, {
            html: '<strong>' + bookoutAmountText + '</strong>',
            style: {
              top: '55px',
              left: '-80px'
            }
          }]
        },
        xAxis: {
          categories: ['', 'Bill of Sale', '', 'Black Book', 'MMR', 'KBB®'],
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
                if (this.y > 0) {
                  return numeral(this.y).format('$0,0[.]00');
                }
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

      if (locations.length > 1) {
        // if there's only one address default the zip to that one
        var defaultAddress = _.find(locations, function(location) {
          return location.IsMainAddress;
        });
        if (!defaultAddress) {
          defaultAddress = locations[0];
        }
        scope.zipCode = defaultAddress.Zip;
      }

      function realignLabels() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        _.each(chart.series[0].data, function(point) {
          // skip if it doesn't have any data label or the y value is undefined or 0.
          if (!point.dataLabel || !point.y) {
            return true;
          }

          // default font color is white.
          var color = '#FFF';
          // get the original data label position.
          var position = point.dataLabel.x;
          // we're using the plotY value here because it's a 90deg rotated bar chart
          if (chart.plotWidth - point.plotY < point.dataLabel.width) {
            position = position + point.dataLabel.width;
            // if it's outside the bar then change it to black.
            color = '#000';
          }

          // update the position and color for the data label.
          point.dataLabel
            .attr({
              x: position
            })
            .css({
              color: color
            });
        });
      }

      function updatePlotInformation() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        var data = chart.series[0].data;
        // only display the plot information when we have value for purchase price.
        if (data[1].y) {
          // calculate the maximum of all the bookout data.
          var projectedPoint = _.max([data[3], data[4], data[5]], function(element) {
            return element.y;
          });
          // calculate the minimum between max bookout vs purchase price
          projectedPoint = _.min([projectedPoint, data[1]], function(element) {
            return element.y;
          });

          scope.projectedFinancedAmount = projectedPoint.y;

          // update the plot line (straight line showing the minimum between max bookout vs purchase price.
          chart.yAxis[0].removePlotLine('max-plot-line');
          chart.yAxis[0].addPlotLine({
            value: projectedPoint.y,
            color: 'black',
            width: 1,
            id: 'max-plot-line'
          });

          // update the triangle and the text at the bottom of the chart.
          if (valuationLabel) {
            valuationLabel.destroy();
            valuationTriangle.destroy();
          }

          var labelX = chart.plotLeft;
          var labelY = chart.plotTop + chart.chartHeight - 45;
          var labelText = projectedPoint.category === 'Bill of Sale' ? purchasePriceLessText : purchasePriceMoreText;

          // the text will have 3 position based on the percentage of where the plot line will be.
          // 0% - 30% - 70%
          var percentage = (chart.plotWidth - projectedPoint.plotY) * 100 / chart.plotWidth;
          if (percentage > 70) {
            labelX = labelX + chart.plotWidth  - 150;
          } else if (percentage > 30 && percentage <= 70) {
            labelX = labelX + ((chart.plotWidth - 150) / 2);
          } else {
            labelX = labelX - 5;
          }

          // render the text on the location.
          valuationLabel = chart.renderer
            .label(
              labelText,
              labelX,
              labelY,
              'square'
            )
            .css({
              color: '#000',
              fontSize: '11px'
            })
            .attr({
              paddingTop: 10,
              zIndex: 6
            })
            .add();

          // render the triangle on the bottom of the plot line.
          // the svg path will start from the top of the triangle,
          // moving right, moving left and then move back to the
          // top of the triangle.
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
      }

      function updateMmrAndBlackbookValuation() {
        var chart = element.find('.nxg-value-lookup').highcharts();
        $q.all([
          Blackbook.lookupByVin(scope.vin, scope.odometer, true),
          Mmr.lookupByVin(scope.vin, scope.odometer)
        ])
          .then(function(results) {
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
            updatePlotInformation();
            realignLabels();
          })
          .catch(function() {
            scope.lookupFailure = scope.lookupFailure || true;
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

            // calculate the min of the averages
            var data = chart.series[0].data;
            data[5].y = minimumKbbAverage ? minimumKbbAverage.Good : 0;
            chart.series[0].setData(data);
            updatePlotInformation();
            realignLabels();
          })
          .catch(function() {
            scope.lookupFailure = scope.lookupFailure || true;
          });
      }

      var valuationLabel, valuationTriangle;

      // watch the purchase value and perform the following:
      // * update the purchase price bar chart
      // * display the line, triangle and text for the purchase price vs bookout value
      scope.$watch('purchasePrice', function(newValue, oldValue) {
        if (oldValue === newValue) {
          return;
        }

        var chart = element.find('.nxg-value-lookup').highcharts();
        // calculate the average of the averages
        var data = chart.series[0].data;
        data[1].y = newValue;
        chart.series[0].setData(data);
        updatePlotInformation();
        realignLabels();
      });

      scope.$watch('vin', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        scope.lookupFailure = false;
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

        scope.lookupFailure = false;
        // update blackbook and mmr values
        if (scope.vin && newValue) {
          updateMmrAndBlackbookValuation();
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
            updateKbbValuation();
          }
        }
      });

      scope.$watch('aditionalFinancing', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }


      });
    }
  }
})();