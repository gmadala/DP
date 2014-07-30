'use strict';

angular.module('nextgearWebApp')
  .controller('CancelPaymentCtrl', function ($scope, $injector, dialog, options, Payments) {
    $scope.payment = options.payment;
    $scope.title = options.title ? options.title : 'Cancel Payment';

    $scope.handleNo = function () {
      dialog.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;
      Payments.cancelScheduled(options.payment.webScheduledPaymentId).then(
        function (/*success*/) {
          $scope.submitInProgress = false;
          if (angular.isDefined(options.onCancel)) {
            options.onCancel();
          }
          dialog.close(true);
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

  });
