'use strict';

angular.module('nextgearWebApp')
  .controller('ConfirmTitleReleaseCheckoutCtrl', function ($scope, $uibModalInstance, response, TitleReleases, Floorplan) {

    var uibModalInstance = $uibModalInstance;
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
      uibModalInstance.close();
    };

  });
