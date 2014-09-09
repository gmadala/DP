'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentSummary', function () {
    return {
      templateUrl: 'scripts/directives/nxgPaymentSummary/nxgPaymentSummary.html',
      restrict: 'A',
      scope: {
        emptyMessage: '@'
      },
      controller: 'PaymentSummaryCtrl'
    };
  })
  .controller('PaymentSummaryCtrl', function ($scope, $state, Payments, metric) {
    //not showing up in html even though it's on rootScope. Adding here.
    $scope.metric = metric;
    $scope.navigate = $state.transitionTo;
    $scope.paymentQueue = Payments.getPaymentQueue();
    $scope.paymentInProgress = Payments.paymentInProgress;

    $scope.removeFee = function (fee) {
      Payments.removeFeeFromQueue(fee.financialRecordId);
    };

    $scope.removePayment = function (payment) {
      Payments.removePaymentFromQueue(payment.id);
    };

    $scope.getCount = function () {
      var count = 0,
          queue = $scope.paymentQueue;

      angular.forEach(queue.fees, function() {
        count++;
      });

      angular.forEach(queue.payments, function() {
        count++;
      });

      return count;
    };

    $scope.getSubtotal = function () {
      // note: if it becomes a performance issue to loop through and recalculate this on every
      // $digest cycle, we could move it into the Payments model and have it only recalculate when
      // an item is actually added to or removed from the payment queue
      var total = 0,
        queue = $scope.paymentQueue;

      angular.forEach(queue.fees, function (fee) {
        total += fee.getCheckoutAmount();
      });

      angular.forEach(queue.payments, function (payment) {
        total += payment.getCheckoutAmount(true);
      });
      return total;
    };

  });
