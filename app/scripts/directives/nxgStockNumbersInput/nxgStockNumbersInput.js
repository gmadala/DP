'use strict';

angular.module('nextgearWebApp')
  .directive('nxgStockNumbersInput', function () {
    return {
      templateUrl: 'scripts/directives/nxgStockNumbersInput/nxgStockNumbersInput.html',
      replace: true,
      scope: {},
      controller: function($scope) {

				$scope.rangeStart = '';
				$scope.rangeEnd = '';
				$scope.stockNos = '';
				$scope.isRange = false;
				$scope.isSpecific = false;

				$scope.selectData = {
					'type' : 'select',
					'value' : 'None',
					'values' : [ 'None', 'Range of Stock #\'s', 'Specific Stock #\'s']
				};

				/* Handle changing the stock number filter select */
				$scope.selectChange = function() {

					/* Show the empty range entry fields as needed */
					if ($scope.selectData.value === $scope.selectData.values[1]) {
						$scope.isRange = true;
						$scope.isSpecific = false;
						$scope.rangeStart = '';
						$scope.rangeEnd = '';
						return;
					}

					/* Show the specific range field as needed */
					if ($scope.selectData.value === $scope.selectData.values[2]) {
						$scope.isRange = false;
						$scope.isSpecific = true;
						$scope.stockNos = '';
						return;
					}

					/* Hide additional fields if "None" was selected */
					$scope.isRange = false;
					$scope.isSpecific = false;
				};
			}
		};
	});
