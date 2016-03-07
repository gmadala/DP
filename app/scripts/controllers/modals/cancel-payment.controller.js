'use strict';

angular.module('nextgearWebApp')
  .controller('CancelPaymentCtrl', function ($scope, $injector, $uibModalInstance, options, Payments, gettextCatalog) {
    var uibModalInstance = $uibModalInstance;
    $scope.payment = options.payment;
    $scope.title = options.title ? options.title : gettextCatalog.getString('Cancel Payment');

    $scope.handleNo = function () {
      uibModalInstance.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;
      Payments.cancelScheduled(options.payment.webScheduledPaymentId).then(
        function (/*success*/) {
          $scope.submitInProgress = false;
          if (angular.isDefined(options.onCancel)) {
            options.onCancel();
          }
          uibModalInstance.close(true);
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

  });
