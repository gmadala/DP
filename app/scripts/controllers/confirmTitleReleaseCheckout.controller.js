(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmTitleReleaseCheckoutCtrl', ConfirmTitleReleaseCheckoutCtrl);

  ConfirmTitleReleaseCheckoutCtrl.$inject = [];

  function ConfirmTitleReleaseCheckoutCtrl($scope, dialog, response, TitleReleases, Floorplan) {

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

    $scope.close = function () {
      dialog.close();
    };

  }
})();
