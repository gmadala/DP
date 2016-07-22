(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmCheckoutCtrl', ConfirmCheckoutCtrl);

  ConfirmCheckoutCtrl.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'queue',
    'transactionInfo',
    'Receipts',
    '$window',
    'api',
    'kissMetricInfo',
    'segmentio',
    'metric'
  ];

  function ConfirmCheckoutCtrl(
    $scope,
    $state,
    $uibModalInstance,
    queue,
    transactionInfo,
    Receipts,
    $window,
    api,
    kissMetricInfo,
    segmentio,
    metric) {

    $scope.today = new Date();

    // split the payments queue into immediate and scheduled
    var paymentsToday = [],
      paymentsScheduled = [],
      feesToday = [],
      feesScheduled = [];

    angular.forEach(queue.payments, function (payment) {
      if (payment.scheduleDate) {
        paymentsScheduled.push(payment);
      } else {
        paymentsToday.push(payment);
      }
    });

    angular.forEach(queue.fees, function (fee) {
      if (fee.scheduleDate) {
        feesScheduled.push(fee);
      } else {
        feesToday.push(fee);
      }
    });

    $scope.items = {
      feesToday: feesToday,
      feesScheduled: feesScheduled,
      paymentsToday: paymentsToday,
      paymentsScheduled: paymentsScheduled,
      getStatus: function (todayText, scheduledText) {
        var statuses = [];
        if ($scope.items.feesToday.length > 0 || $scope.items.paymentsToday.length > 0) {
          statuses.push(todayText);
        }
        if ($scope.items.feesScheduled.length > 0 || $scope.items.paymentsScheduled.length > 0) {
          statuses.push(scheduledText);
        }
        return statuses.join(' and ');
      },
      getTotals: function() {
        var sumItems = function (subTotal, item) {
          return subTotal + item.getCheckoutAmount();
        };

        var totals = {
          feesToday: _.reduce($scope.items.feesToday, sumItems, 0),
          paymentsToday: _.reduce($scope.items.paymentsToday, sumItems, 0),
          feesScheduled: _.reduce($scope.items.feesScheduled, sumItems, 0),
          paymentsScheduled: _.reduce($scope.items.paymentsScheduled, sumItems, 0)
        };

        return totals;
      }
    };

    $scope.receiptUrls = [];
    var url;
    if (transactionInfo) {
      if (transactionInfo.FinancialTransactionId) {
        url = Receipts.getReceiptUrl(transactionInfo.FinancialTransactionId);
        $scope.receiptUrls.push(url);
      }
      if (transactionInfo.UnappliedFundsTransactionId) {
        url = Receipts.getReceiptUrl(transactionInfo.UnappliedFundsTransactionId);
        $scope.receiptUrls.push(url);
      }
    }

    $scope.viewReceipts = function () {
      var stringUrl;
      var transactionId = transactionInfo.FinancialTransactionId;

      if ($scope.format === 'grouped') {
        stringUrl = api.contentLink('/receipt/viewMultiple/receipts', {financialtransactionids: transactionId});
      } else if ($scope.format === 'single') {
        stringUrl = api.ngenContentLink('/encodedReceipts', {transactions: transactionId});
      }

      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.singleVin = $scope.format === 'single';

        segmentio.track(metric.DEALER_CHECKOUT_RECEIPT_GENERATED, result);
      });

      if (stringUrl !== undefined) {
        $window.open(stringUrl, '_blank');
      }
      $state.transitionTo('payments');
      $uibModalInstance.close();
    };

    $scope.close = function () {
      if ($state.current.name === 'checkout') {
        // If user hasn't navigated away, from checkout, go back to payments.
        $state.transitionTo('payments');
      }

      // If user has navigated away, just close the dialog and let them stay here.
      $uibModalInstance.close();
    };

    $scope.openVehicleDetail = function(payment) {
      $uibModalInstance.close();
      $state.go('vehicledetails', {stockNumber: payment.stockNum});
    };

  }
})();
