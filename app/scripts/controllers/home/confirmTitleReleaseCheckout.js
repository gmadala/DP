'use strict';

angular.module('nextgearWebApp')
  .controller('ConfirmTitleReleaseCheckoutCtrl', function ($scope, dialog) {

    $scope.close = function () {
      dialog.close();
    };

  });
