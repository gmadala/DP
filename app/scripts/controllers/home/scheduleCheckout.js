'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduleCheckoutCtrl', function ($scope, dialog) {

    $scope.close = function() {
      dialog.close();
    };

  });
