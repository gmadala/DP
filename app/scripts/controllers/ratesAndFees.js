'use strict';

angular.module('nextgearWebApp')
  .controller('RatesAndFeesCtrl', function ($scope, dialog) {

    // Allow the dialog to close itself using the "Close" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };
  });
