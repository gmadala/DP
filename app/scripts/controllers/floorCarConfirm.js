'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarConfirmCtrl', function ($scope, dialog, formData) {
    // access to all the data the user entered in the form (a copy)
    $scope.formData = formData;

    $scope.confirm = function () {
      dialog.close(true);
    };

    $scope.cancel = function () {
      dialog.close(false);
    };

    // note: no controller services for opening "View Vehicle Verification Checklist" link -- it's just a static link
    // to https://test.discoverdsc.com/MyDSC/documents/DSC%20Vehicle%20Verification%20Checklist.pdf with a _blank target
  });
