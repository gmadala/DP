'use strict';

angular.module('nextgearWebApp')
.controller('PaymentDetailsCtrl', function ($scope, dialog, activity) {
    $scope.payment = activity;

    // Allow the dialog to close itself using the "Close" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };
  });
