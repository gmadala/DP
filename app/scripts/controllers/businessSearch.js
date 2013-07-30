'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function ($scope, dialog, BusinessSearch) {

    $scope.businessSearch = new BusinessSearch();

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };
  });
