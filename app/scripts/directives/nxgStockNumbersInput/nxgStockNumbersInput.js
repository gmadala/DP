'use strict';

angular.module('nextgearWebApp')
  .directive('nxgStockNumbersInput', function () {
    return {
      templateUrl: 'scripts/directives/nxgStockNumbersInput/nxgStockNumbersInput.html',
      replace: true,
      scope: {},
      controller: 'StockNumbersInputCtrl'
    };
  })
  .controller('StockNumbersInputCtrl', function ($scope) {
	  
  });
