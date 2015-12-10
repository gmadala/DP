'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarMessageCtrl', function ($scope, dialog, canAttachDocuments, createFloorplan, floorSuccess, uploadSuccess) {
    // access to all the data the user entered in the form (a copy)
    $scope.floorSuccess = floorSuccess;
    $scope.uploadSuccess = uploadSuccess;
    $scope.canAttachDocuments = canAttachDocuments;
    $scope.createFloorplan = createFloorplan;

    $scope.close = function () {
      dialog.close();
    };
  });

