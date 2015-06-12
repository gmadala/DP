'use strict';

angular.module('nextgearWebApp')
  .controller('UpdateFinancialAccount', function($scope, dialog, $dialog, options) {
    $scope.account = options.account;

    $scope.confirmRequest = function() {
    };

    $scope.close = dialog.close;
  });
