'use strict';

angular.module('nextgearWebApp')
  .controller('TopAuctionsCtrl', function ($scope, dialog, auctions) {

    $scope.data = auctions;

    // Allow the dialog to close itself using the "Close" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };
  });
