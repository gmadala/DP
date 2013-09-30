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
  .controller('PaymentSummaryCtrl', function ($scope, $state, Payments) {

    $scope.navigate = $state.transitionTo;

    $scope.paymentQueue = Payments.getPaymentQueue();

    $scope.removeFee = function (fee) {
      Payments.removeFeeFromQueue(fee.financialRecordId);
    };

    $scope.removePayment = function (payment) {
      Payments.removePaymentFromQueue(payment.floorplanId);
    };

    $scope.getSubtotal = function () {
      // note: if it becomes a performance issue to loop through and recalculate this on every
      // $digest cycle, we could move it into the Payments model and have it only recalculate when
      // an item is actually added to or removed from the payment queue
      var total = 0,
        queue = $scope.paymentQueue;

      angular.forEach(queue.fees, function (fee) {
        total += fee.amount;
      });

      angular.forEach(queue.payments, function (payment) {
        total += payment.amount;
      });

      return total;
    };

  });
