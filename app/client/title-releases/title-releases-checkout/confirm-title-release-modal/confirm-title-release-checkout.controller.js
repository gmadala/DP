(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmTitleReleaseCheckoutCtrl', ConfirmTitleReleaseCheckoutCtrl);

  ConfirmTitleReleaseCheckoutCtrl.$inject = ['$scope', 'TitleReleases', 'Floorplan', '$state', '$stateParams'];

  function ConfirmTitleReleaseCheckoutCtrl($scope, TitleReleases, Floorplan, $state, $stateParams) {

    $scope.backToTitleReleases = function () {
      $state.transitionTo('titlereleases');
    };


    var response = {};
    if ($stateParams.data) {
      response = $stateParams.data;
    } else {
      // If no confirm data go back to title releases
      TitleReleases.clearQueue();
      $scope.backToTitleReleases();
    }

    $scope.counts = {
      total: response.TitleReleaseResults.length,
      failed: _.reduce(response.TitleReleaseResults, function(sum, item){
        return sum + (item.ReleaseSuccessful ? 0 : 1);
      }, 0)
    };

    $scope.results = _.map(response.TitleReleaseResults, function(result) {
      var floorplan = _.find(TitleReleases.getQueue(), function(floorplanInQueue) {
        return floorplanInQueue.FloorplanId === result.FloorplanId;
      });

      if(floorplan) {
        floorplan.ReleaseSuccessful = result.ReleaseSuccessful;
        floorplan.description = Floorplan.getVehicleDescription(floorplan);
        return floorplan;
      } else {
        return result;
      }
    });
    TitleReleases.clearQueue();
  }
})();
