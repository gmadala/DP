'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleaseCheckoutCtrl', function($scope, $dialog, $state, TitleReleases, Floorplan, TitleAddresses) {

    $scope.titleQueue = {
      contents: TitleReleases.getQueue(),
      sum: function() {
        return _.reduce($scope.titleQueue.contents, function(accumulator, item) {
          return accumulator + item.AmountFinanced;
        }, 0);
      },
      removeFromQueue: TitleReleases.removeFromQueue
    };

    $scope.addresses = TitleAddresses.getAddresses();
    $scope.toShortAddress = function(addressObj) {
      if(addressObj) {
        return addressObj.Line1 + (addressObj.Line2 ? ' ' + addressObj.Line2 : '') + ' / ' + addressObj.City + ' ' + addressObj.State + ' ' + addressObj.Zip;
      } else {
        return '';
      }
    };

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;
    $scope.eligibility = TitleReleases.getTitleReleaseEligibility();
    $scope.titleLabel = $scope.titleQueue.contents.length === 1 ? 'Title Requested' : 'Titles Requested';

    $scope.onConfirmRequest = function() {
      $scope.submitting = true;
      TitleReleases.makeRequest().then(function(response) {
        $scope.submitting = false;
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

        $dialog.dialog(dialogOptions).open().then(function() {
          TitleReleases.clearQueue();

          $state.transitionTo('home.titlereleases');
        });
      });
    };
  });
