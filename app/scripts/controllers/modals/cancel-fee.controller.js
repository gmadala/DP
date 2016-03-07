'use strict';

angular.module('nextgearWebApp')
  .controller('CancelFeeCtrl', function ($scope, $injector, $uibModalInstance, options, Payments, gettextCatalog) {
    var uibModalInstance = $uibModalInstance;
    $scope.fee = options.fee;
    $scope.title = options.title ? options.title : gettextCatalog.getString('Cancel Fee');

    $scope.handleNo = function () {
      uibModalInstance.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;

      Payments.cancelScheduledFee(options.fee.webScheduledAccountFeeId).then(
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
