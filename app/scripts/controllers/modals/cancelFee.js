'use strict';

angular.module('nextgearWebApp')
  .controller('CancelFeeCtrl', function ($scope, $injector, dialog, options, Payments) {
    $scope.fee = options.fee;
    $scope.title = options.title ? options.title : 'Cancel Fee';

    $scope.handleNo = function () {
      dialog.close(false);
    };

    $scope.handleYes = function () {
      $scope.submitInProgress = true;

      Payments.cancelScheduledFee(options.fee.webScheduledAccountFeeId).then(
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
