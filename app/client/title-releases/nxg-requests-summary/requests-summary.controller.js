(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('RequestsSummaryCtrl', RequestsSummaryCtrl);

  RequestsSummaryCtrl.$inject = ['$scope', '$state', 'TitleReleases', 'Floorplan'];

  function RequestsSummaryCtrl($scope, $state, TitleReleases, Floorplan) {
    $scope.titleQueue = {
      contents: TitleReleases.getQueue(),
      removeFromQueue: TitleReleases.removeFromQueue
    };

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;

    $scope.navigate = $state.transitionTo;
  }

})();
