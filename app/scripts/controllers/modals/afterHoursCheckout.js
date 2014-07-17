'use strict';

angular.module('nextgearWebApp')
  .controller('AfterHoursCheckoutCtrl', function ($scope, dialog, ejectedFees, ejectedPayments, autoScheduleDate) {
    $scope.ejectedFees = ejectedFees;
    $scope.ejectedPayments = ejectedPayments;
    $scope.autoScheduleDate = autoScheduleDate;

    $scope.close = function () {
      dialog.close();
    };
  });
