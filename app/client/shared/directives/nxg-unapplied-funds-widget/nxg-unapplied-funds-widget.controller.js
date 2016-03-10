(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('UnappliedFundsWidgetCtrl', UnappliedFundsWidgetCtrl);

  UnappliedFundsWidgetCtrl.$inject = ['$scope', '$uibModal', '$filter', 'api', 'gettextCatalog', 'AccountManagement'];

  function UnappliedFundsWidgetCtrl($scope, $uibModal, $filter, api, gettextCatalog, AccountManagement) {

    var uibModal = $uibModal;

    AccountManagement.get().then(function (result) {
      $scope.autoDisburseUnappliedFunds = result.AutoDisburseUnappliedFundsDaily;
    });


    $scope.openRequestPayout = function($event) {
      $event.preventDefault();

      var dialogOptions = {
        dialogClass: 'modal request-unapplied-funds-modal',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'client/shared/directives/nxg-unapplied-funds-widget/request-payout-modal.html',
        controller: 'PayoutModalCtrl',
        resolve: {
          funds: function () {
            return {
              balance: $scope.fundsBalance,
              available: $scope.fundsAvail
            };
          }
        }
      };

      uibModal.open(dialogOptions).result.then(
        function (result) {
          if (result) {
            // ** The endpoint returns a single updated balance but we got two
            // to update (total, available) so we update manually **
            result.amount = api.toFloat(result.amount);
            $scope.fundsAvail -= Math.min(result.amount, $scope.fundsAvail);
            $scope.fundsBalance -= Math.min(result.amount, $scope.fundsBalance);

            // wireframes do not specify any kind of success display, so let's just do a simple one
            var title = gettextCatalog.getString('Request submitted'),
              message = gettextCatalog.getString('Your request for a payout in the amount of {{ amount }} to your account "{{ bankAccountName }}" has been successfully submitted.', {
                amount: $filter('currency')(result.amount),
                bankAccountName: result.account.BankAccountName
              }),
              buttons = [{label: gettextCatalog.getString('OK'), cssClass: 'btn-cta cta-primary'}];
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'client/shared/modals/message-box/message-box.html',
              controller: 'MessageBoxCtrl',
              dialogClass: 'modal modal-medium',
              resolve: {
                title: function () {
                  return title;
                },
                message : function() {
                  return message;
                },
                buttons: function () {
                  return buttons;
                }
              }
            };
            uibModal.open(dialogOptions);
          }
        }
      );
    };

  }
})();
