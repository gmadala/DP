'use strict';

angular.module('nextgearWebApp')
  .directive('nxgStockNumbersInput', function () {
    return {
      templateUrl: 'scripts/directives/nxgStockNumbersInput/nxgStockNumbersInput.html',
      replace: true,
      scope: {
        data: '=data',
        validity: '=',
				form: '=form',
      },
      controller: function($scope) {

				if (!$scope.data) {
					$scope.data = {};
				}

				$scope.data.rangeStart = '';
				$scope.data.rangeEnd = '';
				$scope.data.stockNos = '';
				$scope.isRange = false;
				$scope.isSpecific = false;

				$scope.data.selectData = {
					'type' : 'select',
					'value' : 'None',
					'values' : [ 'None', 'Range of Stock #\'s', 'Specific Stock #\'s']
				};

				/* Handle changing the stock number filter select */
				$scope.selectChange = function() {

					/* Show the empty range entry fields as needed */
					if ($scope.data.selectData.value === $scope.data.selectData.values[1]) {
						$scope.isRange = true;
						$scope.isSpecific = false;
						$scope.data.rangeStart = '';
						$scope.data.rangeEnd = '';
						return;
					}

					/* Show the specific range field as needed */
					if ($scope.data.selectData.value === $scope.data.selectData.values[2]) {
						$scope.isRange = false;
						$scope.isSpecific = true;
						$scope.data.stockNos = '';
						return;
					}

					/* Hide additional fields if "None" was selected */
					$scope.isRange = false;
					$scope.isSpecific = false;
					$scope.data.rangeStart = '';
					$scope.data.rangeEnd = '';
					$scope.data.stockNos = '';
				};
			}
		};
	});
