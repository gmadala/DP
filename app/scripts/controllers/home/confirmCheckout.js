'use strict';

angular.module('nextgearWebApp')
  .controller('ConfirmCheckoutCtrl', function ($scope, dialog) {

    $scope.close = function() {
      dialog.close();
    };

  });
