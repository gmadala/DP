(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ExtensionRequestCtrl', ExtensionRequestCtrl);

  ExtensionRequestCtrl.$inject = ['$scope', '$uibModalInstance', 'gettextCatalog', 'payment', 'onConfirm', 'Payments', 'Floorplan'];

  function ExtensionRequestCtrl($scope, $uibModalInstance, gettextCatalog, payment, onConfirm, Payments, Floorplan) {

    var uibModalInstance = $uibModalInstance;
    //TODO changes in here for 3893
    $scope.payment = payment;

    $scope.isEnglish = gettextCatalog.currentLanguage === 'en';

    Floorplan.getExtensionPreview(payment.FloorplanId).then(function(result) {
      $scope.extPrev = result;

      var feeTotal = _.reduce($scope.extPrev.Fees, function(sum, fee) {
        return sum + fee.Amount;
      }, 0);

      $scope.subtotal = $scope.extPrev.PrincipalAmount + $scope.extPrev.InterestAmount + feeTotal + $scope.extPrev.CollateralProtectionAmount;
    }, function() {
      $scope.extPrev = {
        CanExtend: false
      };
    });

    $scope.closeDialog = function(){
      uibModalInstance.close();
    };

    $scope.onConfirm = function() {
      onConfirm();
      uibModalInstance.close();
    };

    $scope.confirmRequest = function() {
      if($scope.extPrev.CanExtend) {
        Payments.requestExtension(payment.FloorplanId).then(function() {
          $scope.onConfirm();
        });
      } else {
        uibModalInstance.close();
      }
    };

  }
})();
