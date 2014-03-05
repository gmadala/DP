'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleaseCheckoutCtrl', function($scope, $dialog) {
    $scope.onConfirmRequest = function() {
      var dialogOptions = {
        dialogClass: 'modal confirm-title-request',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'views/modals/confirmTitleRequest.html',
        controller: 'ConfirmTitleReleaseCheckoutCtrl'
      };

      $dialog.dialog(dialogOptions).open();
    };
  });
