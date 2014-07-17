'use strict';

angular.module('nextgearWebApp')
.controller('PaymentDetailsCtrl', function ($scope, dialog, activity) {
  $scope.payment = activity;

  $scope.close = function() {
    dialog.close();
  };
});
