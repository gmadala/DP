(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('TitleReleaseCheckoutCtrl', TitleReleaseCheckoutCtrl);

  TitleReleaseCheckoutCtrl.$inject = [
    '$scope',
    '$state',
    'TitleReleases',
    'Floorplan',
    'Addresses',
    'kissMetricInfo',
    'segmentio',
    'metric'
  ];

  function TitleReleaseCheckoutCtrl(
    $scope,
    $state,
    TitleReleases,
    Floorplan,
    Addresses,
    kissMetricInfo,
    segmentio,
    metric) {

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

    $scope.onConfirmRequest = function() {
      $scope.submitting = true;
      TitleReleases.makeRequest().then(function(response) {
        $scope.submitting = false;

        kissMetricInfo.getKissMetricInfo().then(function (result) {
          result.titles = $scope.titleQueue.contents.length;

          segmentio.track(metric.DEALER_TITLE_RELEASE_REQUEST, result);
        });

        var params = {};
        params = response;
        TitleReleases.clearQueue();
        $state.go('titleReleaseConfirm', {data: params});
      });
    };

  }
})();
