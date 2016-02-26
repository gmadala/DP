(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('CancelFeeCtrl', CancelFeeCtrl);

  CancelFeeCtrl.$inject = ['$scope', 'dialog', 'options', 'Payments', 'gettextCatalog'];

  function CancelFeeCtrl($scope, dialog, options, Payments, gettextCatalog) {

    $scope.fee = options.fee;
    $scope.title = options.title ? options.title : gettextCatalog.getString('Cancel Fee');

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

  }

})();
