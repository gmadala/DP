'use strict';

angular.module('nextgearWebApp')
  .controller('UpdateFinancialAccount', function($scope, dialog, $dialog, options) {
    console.log(options);
    console.log(dialog);
    console.log($dialog);

    $scope.confirmRequest = function() {
      console.log('Confirming request ...');
    };

    $scope.close = dialog.close;
  });
