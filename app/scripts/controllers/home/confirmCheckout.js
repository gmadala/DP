'use strict';

angular.module('nextgearWebApp')
  .controller('ConfirmCheckoutCtrl', function ($scope, $state, dialog, queue, transactionInfo, Receipts, segmentio, metric, $window) {

    $scope.today = new Date();

    // split the payments queue into immediate and scheduled
    var paymentsToday = [],
      paymentsScheduled = [];
    angular.forEach(queue.payments, function (payment) {
      if (payment.scheduleDate) {
        paymentsScheduled.push(payment);
      } else {
        paymentsToday.push(payment);
      }
    });

    $scope.items = {
      fees: _.map(queue.fees),
      paymentsToday: paymentsToday,
      paymentsScheduled: paymentsScheduled,
      getStatus: function (todayText, scheduledText) {
        var statuses = [];
        if ($scope.items.fees.length > 0 || $scope.items.paymentsToday.length > 0) {
          statuses.push(todayText);
        }
        if ($scope.items.paymentsScheduled.length > 0) {
          statuses.push(scheduledText);
        }
        return statuses.join(' and ');
      },
      todayTotal: function () {
        var sumItems = function (subTotal, item) {
          return subTotal + item.amount;
        };
        var total = _.reduce($scope.items.fees, sumItems, 0);
        return _.reduce($scope.items.paymentsToday, sumItems, total);
      }
    };

    if (paymentsScheduled.length > 0) {
      segmentio.track(metric.SCHEDULE_PAYMENT); // Server is responsible for tracking revenue when schedule occurs
    }

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
      angular.forEach($scope.receiptUrls, function(url) {
        $window.open(url);
      });
      $state.transitionTo('home.payments');
      dialog.close();
    };

    $scope.close = function () {
      $state.transitionTo('home.payments');
      dialog.close();
    };

  });
