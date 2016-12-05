(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgValueLookup', nxgValueLookup);

  nxgValueLookup.$inject = ['$q', 'Addresses', 'gettext', 'gettextCatalog', 'Blackbook'];

  function nxgValueLookup(gettext, gettextCatalog) {

    gettext('Purchase Amount');
    gettext('Average Bookout');
    gettext('Purchase price less than <br /> highest average bookout');
    gettext('Purchase price more than <br /> highest average bookout');

    return {
      templateUrl: 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html',
      restrict: 'E',
      scope: {
        mmr: '=',
        blackbook: '=',
        purchasePrice: '=',
        projectedFinancedAmount: '='
      },
      replace: 'true',
      link: linkFn
    };

    function linkFn(scope, element) {
      // local vars for translations
      var purchasePriceText = gettextCatalog.getString('Purchase Price');
      var bookoutAmountText = gettextCatalog.getString('Bookout Amount');
      var purchasePriceLessText = gettextCatalog.getString('Purchase price less than <br /> highest average bookout');
      var purchasePriceMoreText = gettextCatalog.getString('Highest average bookout <br /> less than purchase price');
      var purchasePriceOnlyText = gettextCatalog.getString('Only purchase price data <br /> is available');
      // local vars to hold svg references
      var valuationLabel, valuationTriangle;

      // init the options for the chart
      element.find('.nxg-value-lookup').highcharts(createOptions());

      /** Watchers list **/
      // watch the purchase value and perform the following:
      // * update the purchase price bar chart
      // * display the line, triangle and text for the purchase price vs bookout value
      scope.$watch('purchasePrice', function(newValue, oldValue) {
        if (oldValue !== newValue) {
          var chart = getChart();
          var data = chart.series[0].data;
          data[1].y = newValue;
          chart.series[0].setData(data);
          updatePlotInformation();
          realignLabels();
        }
      });

      scope.$watch('blackbook', function(newValue, oldValue) {
        if (oldValue !== newValue) {
          var chart = getChart();
          var data = chart.series[0].data;
          data[3].y = newValue;
          chart.series[0].setData(data);
          realignLabels();
        }
      });

      scope.$watch('mmr', function(newValue, oldValue) {
        if (oldValue !== newValue) {
          var chart = getChart();
          var data = chart.series[0].data;
          data[4].y = newValue;
          chart.series[0].setData(data);
          realignLabels();
        }
      });

      /** Supporting local functions **/

      /*
       * Function to realign the position of the data label when the bar doesn't have enough room
       * to display the data label.
       */
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

      /*
       * Function to update the plot line, triangle position and information text position.
       */
      function updatePlotInformation() {
        var chart = getChart();
        var data = chart.series[0].data;

        var labelText, labelX, labelY;
        // only display the plot information when we have value for purchase price.
        if (data[1].y) {
          var projectedPoint;

          // calculate the maximum of all the bookout data.
          projectedPoint = _.max([data[3], data[4]], function(element) {
            return element.y;
          });

          if (projectedPoint.y > 0) {
            // calculate the minimum between max bookout vs purchase price
            projectedPoint = _.min([projectedPoint, data[1]], function(element) {
              return element.y;
            });
            // the text will be depends on which one is the selected as projected financed amount.
            labelText = projectedPoint.category === 'Bill of Sale' ? purchasePriceLessText : purchasePriceMoreText;
          } else {
            projectedPoint = data[1];
            // the text label will be the purchase price only text
            labelText = purchasePriceOnlyText;
          }

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
          labelX = chart.plotLeft;
          labelY = chart.plotTop + chart.chartHeight - 45;

          // the text will have 3 position based on the percentage of where the plot line will be.
          // 0% - 30% - 70%
          var percentage = (chart.plotWidth - projectedPoint.plotY) * 100 / chart.plotWidth;
          if (percentage > 70) {
            labelX = labelX + chart.plotWidth - 145;
          } else if (percentage > 30 && percentage <= 70) {
            labelX = labelX + ((chart.plotWidth - 145) / 2);
          } else {
            labelX = labelX - 5;
          }

          // render the text on the location.
          if (valuationLabel) {
            valuationLabel.destroy();
          }
          valuationLabel = drawBottomInfoText(labelText, labelX, labelY);
          // render the triangle on the bottom of the plot line.
          if (valuationTriangle) {
            valuationTriangle.destroy();
          }
          valuationTriangle = drawTriangleMarker(projectedPoint.plotY, labelY);
        } else {
          scope.projectedFinancedAmount = 0;
          // update the triangle and the text at the bottom of the chart.
          if (valuationLabel) {
            valuationLabel.destroy();
            valuationLabel = undefined;
          }

          if (valuationTriangle) {
            valuationTriangle.destroy();
            valuationTriangle = undefined;
          }
        }
      }

      /*
       * Get the reference to the highchart object.
       */
      function getChart() {
        return element.find('.nxg-value-lookup').highcharts();
      }

      /*
       * Function to draw the little triangle svg.
       *
       * The svg path will start from the top of the triangle, moving down to the right,
       * moving left and then move back to the starting point of the triangle.
       */
      function drawTriangleMarker(startingX, startingY) {
        var chart = getChart();
        return chart.renderer
          .path(
            ['M', chart.plotLeft + chart.plotWidth - startingX, startingY,
              'L', chart.plotLeft + chart.plotWidth - startingX + 5, startingY + 5,
              'L', chart.plotLeft + chart.plotWidth - startingX - 5, startingY + 5,
              'L', chart.plotLeft + chart.plotWidth - startingX, startingY])
          .attr({
            fill: 'rgba(0, 0, 0, 0.75)',
            zIndex: 6
          })
          .add();
      }

      /*
       * Function to draw the bottom text information.
       */
      function drawBottomInfoText(text, x, y) {
        var chart = getChart();
        return chart.renderer
          .label(text, x, y, 'square')
          .css({
            color: '#000',
            fontSize: '11px'
          })
          .attr({
            paddingTop: 10,
            zIndex: 6
          })
          .add();
      }

      /*
       * Base options for the highchart component
       */
      function createOptions() {
        return {
          chart: {
            backgroundColor: null,
            type: 'bar',
            height: 175,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 50,
            marginLeft: 85
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
            categories: ['', 'Bill of Sale', '', 'Black Book', 'MMR'],
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
            }]
          }]
        };
      }
    }
  }
})();