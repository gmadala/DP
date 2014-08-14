'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarConfirmCtrl', function ($scope, dialog, formData, isDealer) {
    // access to all the data the user entered in the form (a copy)
    $scope.formData = formData;

    // mode
    $scope.isDealer = isDealer;

    $scope.confirm = function () {
      dialog.close(true);
    };

    $scope.close = function () {
      dialog.close(false);
    };
  });
