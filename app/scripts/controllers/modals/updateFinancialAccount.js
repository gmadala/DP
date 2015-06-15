'use strict';

angular.module('nextgearWebApp')
  .controller('UpdateFinancialAccount', function($scope, dialog, $dialog, options) {
    $scope.account = options.account;
    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;

    $scope.confirmRequest = function() {
    };

    $scope.close = dialog.close;
  });
