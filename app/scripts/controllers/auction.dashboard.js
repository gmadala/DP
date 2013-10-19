'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDashboardCtrl', function($scope, Dashboard) {

    $scope.dashboardData = Dashboard.fetchAuctionDashboard();

    $scope.selectedFloorplanChart = 'year';

    $scope.$watch('selectedFloorplanChart', function(newVal) {

      var range = -1;  // See API for full definition, 0 = week, 1 = month, 2 = year

      switch(newVal) {
      case 'year':
        range = 2;
        break;
      case 'month':
        range = 1;
        break;
      case 'week':
        range = 0;
        break;
      default:
        throw 'Unexpected value for filtering floorplan chart!';
      }

      $scope.chartData = Dashboard.fetchFloorplanChartData(range);

    });
  });
