'use strict';

angular.module('nextgearWebApp')
  .controller('FinancialAccount', function($scope, dialog, $dialog, options) {
    $scope.account = options.account;
    //$scope.account = { };
    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;
    $scope.accountNumberDisplay = $scope.account.AchAccountNumberLast4 ? '******' + $scope.account.AchAccountNumberLast4 : '';
    $scope.routingNumberDisplay = $scope.account.AchAbaNumber;

    $scope.confirmRequest = function() {
      $scope.validity = angular.copy($scope.financialAccountForm);
    };

    $scope.close = dialog.close;
  });
