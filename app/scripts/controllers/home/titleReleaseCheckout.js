'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleaseCheckoutCtrl', function($scope, $dialog, TitleReleases, Floorplan) {

    $scope.titleQueue = {
      contents: TitleReleases.getQueue(),
      sum: function() {
        return _.reduce($scope.titleQueue.contents, function(accumulator, item) {
          return accumulator + item.AmountFinanced;
        }, 0);
      },
      removeFromQueue: TitleReleases.removeFromQueue
    };

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;
    $scope.eligibility = TitleReleases.getTitleReleaseEligibility();

    $scope.onConfirmRequest = function() {
      TitleReleases.makeRequest().then(function(response) {
        var dialogOptions = {
          resolve: {
            response: function() {return response;}
          },
          dialogClass: 'modal confirm-title-request',
          backdrop: true,
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/confirmTitleRequest.html',
          controller: 'ConfirmTitleReleaseCheckoutCtrl'
        };

        $dialog.dialog(dialogOptions).open();
      });
    };
  });
