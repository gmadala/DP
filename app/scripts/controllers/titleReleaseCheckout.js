'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleaseCheckoutCtrl', function($scope, $dialog, $state, TitleReleases, Floorplan, Addresses, gettextCatalog) {

    $scope.titleQueue = {
      contents: TitleReleases.getQueue(),
      sum: function() {
        return _.reduce($scope.titleQueue.contents, function(accumulator, item) {
          return accumulator + item.AmountFinanced;
        }, 0);
      },
      removeFromQueue: TitleReleases.removeFromQueue
    };

    $scope.addresses = Addresses.getTitleAddresses();

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;
    TitleReleases.getTitleReleaseEligibility().then(function (data) {
      $scope.eligibility = data;
    });
    $scope.titleLabel = gettextCatalog.getPlural($scope.titleQueue.contents.length, 'Title Requested', 'Titles Requested');

    $scope.onConfirmRequest = function() {
      $scope.submitting = true;
      TitleReleases.makeRequest().then(function(response) {
        $scope.submitting = false;
        var dialogOptions = {
          resolve: {
            response: function() {return response;}
          },
          dialogClass: 'modal modal-medium modal-long',
          backdrop: true,
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/confirmTitleRequest.html',
          controller: 'ConfirmTitleReleaseCheckoutCtrl'
        };

        $dialog.dialog(dialogOptions).open().then(function() {
          TitleReleases.clearQueue();

          $state.transitionTo('titlereleases');
        });
      });
    };
  });
