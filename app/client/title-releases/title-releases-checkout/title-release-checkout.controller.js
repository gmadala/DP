(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('TitleReleaseCheckoutCtrl', TitleReleaseCheckoutCtrl);

  TitleReleaseCheckoutCtrl.$inject = [
    '$scope',
    '$uibModal',
    '$state',
    'TitleReleases',
    'Floorplan',
    'Addresses',
    'kissMetricInfo',
    'segmentio',
    'metric',
    'gettextCatalog'
  ];

  function TitleReleaseCheckoutCtrl(
    $scope,
    $uibModal,
    $state,
    TitleReleases,
    Floorplan,
    Addresses,
    kissMetricInfo,
    segmentio,
    metric,
    gettextCatalog) {

    var uibModal = $uibModal;

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
          backdrop: 'static',
          keyboard: false,
          backdropClick: false,
          templateUrl: 'client/title-releases/title-releases-checkout/confirm-title-release-modal/confirm-title-request.template.html',
          controller: 'ConfirmTitleReleaseCheckoutCtrl'
        };

        kissMetricInfo.getKissMetricInfo().then(function (result) {
          result.titles = $scope .titleQueue.contents.length;

          segmentio.track(metric.DEALER_TITLE_RELEASE_REQUEST, result);
        });

        uibModal.open(dialogOptions).result.then(function() {
          TitleReleases.clearQueue();

          $state.transitionTo('titlereleases');
        });
      });
    };

  }
})();
