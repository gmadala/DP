'use strict';

angular.module('nextgearWebApp')
.controller('FeeDetailsCtrl', function ($scope, dialog, activity) {
  $scope.fee = activity;

  $scope.close = function() {
    dialog.close();
  };
});
