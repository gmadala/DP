(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmTitleReleaseCheckoutCtrl', ConfirmTitleReleaseCheckoutCtrl);

  ConfirmTitleReleaseCheckoutCtrl.$inject = ['$scope', 'TitleReleases', 'Floorplan', '$state', '$stateParams'];

  function ConfirmTitleReleaseCheckoutCtrl($scope, TitleReleases, Floorplan, $state, $stateParams) {

    $scope.backToTitleReleases = function () {
      TitleReleases.clearQueue();
      $state.transitionTo('titlereleases');
    };

    $scope.hasData = function () {
      if ($stateParams.data) {
        return true;
      } else {
        $scope.backToTitleReleases();
      }
    };

    if ($scope.hasData()) {
      var response = $stateParams.data;
      $scope.counts = {
        total: response.TitleReleaseResults.length,
        failed: _.reduce(response.TitleReleaseResults, function (sum, item) {
          return sum + (item.ReleaseSuccessful ? 0 : 1);
        }, 0)
      };

      $scope.results = _.map(response.TitleReleaseResults, function (result) {
        var floorplan = _.find(TitleReleases.getQueue(), function (floorplanInQueue) {
          return floorplanInQueue.FloorplanId === result.FloorplanId;
        });

        if (floorplan) {
          floorplan.ReleaseSuccessful = result.ReleaseSuccessful;
          floorplan.description = Floorplan.getVehicleDescription(floorplan);
          return floorplan;
        } else {
          return result;
        }
      });
      TitleReleases.clearQueue();
    }
  }
})();
