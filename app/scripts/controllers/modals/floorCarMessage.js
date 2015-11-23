'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarMessageCtrl', function ($scope, dialog, floorSuccess, uploadSuccess) {
    // access to all the data the user entered in the form (a copy)
    $scope.floorSuccess = floorSuccess;
    $scope.uploadSuccess = uploadSuccess;

    $scope.close = function () {
      dialog.close();
    };
  });

