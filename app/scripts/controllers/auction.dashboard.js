'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDashboardCtrl', function($scope, Dashboard) {

    $scope.floorplanChartOptions = ['This Year', 'This Month', 'This Week'];
    $scope.floorplanChartSelection = 'This Year';

    $scope.dashboardData = Dashboard.fetchAuctionDashboard();

    $scope.$watch('floorplanChartSelection', function(newVal) {

      var range = -1;  // See API for full definition, 0 = week, 1 = month, 2 = year

      switch(newVal) {
      case 'This Year':
        range = 2;
        break;
      case 'This Month':
        range = 1;
        break;
      case 'This Week':
        range = 0;
        break;
      default:
        throw 'Unexpected value for filtering floorplan chart!';
      }

      $scope.chartData = Dashboard.fetchFloorplanChartData(range);
    });
  });
