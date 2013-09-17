'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentSummary', function () {
    return {
      templateUrl: 'scripts/directives/nxgPaymentSummary/nxgPaymentSummary.html',
      restrict: 'A',
      scope: {},
      controller: 'PaymentSummaryCtrl'
    };
  })
  .controller('PaymentSummaryCtrl', function ($scope) {
    // dummy data - payment queue
    $scope.queue = [{
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    },
      {
        vin: 'CH224157',
        make: 'Toyota',
        model: 'Corolla',
        payment: 3544.49,
        year: 2013
      },
      {
        vin: 'CH224157',
        make: 'Toyota',
        model: 'Corolla',
        payment: 3544.49,
        year: 2013
      }];
    $scope.total = 3544.49*3;
    $scope.fees=[{ type: 'Collateral Audit', payment: 150}];
    // end dummy data
  });
