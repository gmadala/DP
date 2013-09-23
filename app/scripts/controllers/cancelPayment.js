'use strict';

angular.module('nextgearWebApp')
  .controller('CancelPaymentCtrl', function ($scope, $injector, dialog, options, Payments) {
    $scope.payment = options.payment;
    $scope.title = options.title ? options.title : 'Are you sure you would like to cancel your scheduled payment?';

    $scope.handleNo = function () {
      dialog.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;
      Payments.cancelScheduled(options.payment).then(
        function (/*success*/) {
          $scope.submitInProgress = false;
          if (angular.isDefined(options.onCancel)) {
            options.onCancel();
          }
          dialog.close(true);
        }, function (error) {
          $scope.submitInProgress = false;
          $scope.submitError = error || 'Unable to cancel this payment. Please contact NextGear for assistance.';
        }
      );
    };

  });
