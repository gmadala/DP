'use strict';

angular.module('nextgearWebApp')
  .controller('CancelPaymentCtrl', function ($scope, dialog, payment, Payments) {
    $scope.payment = payment;

    $scope.handleNo = function () {
      dialog.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;
      Payments.cancelScheduled(payment).then(
        function (/*success*/) {
          $scope.submitInProgress = false;
          dialog.close(true);
        }, function (error) {
          $scope.submitInProgress = false;
          $scope.submitError = error || 'Unable to cancel this payment. Please contact NextGear for assistance.';
        }
      );
    };

  });
