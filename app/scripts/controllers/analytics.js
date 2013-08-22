'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog) {
    $scope.openTopAuctions = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/topAuctions.html',
        controller: 'TopAuctionsCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
