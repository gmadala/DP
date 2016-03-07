'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDashboardCtrl', function($scope, Dashboard, api, $state) {

    $scope.dashboardData = {};
    Dashboard.fetchAuctionDashboard().then(function(data) {
      $scope.dashboardData = data;
    });

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
        throw new Error('Unexpected value for filtering floorplan chart!');
      }
      Dashboard.fetchFloorplanChartData(range).then(function (data) {
        $scope.chartData = data;
      });
    });

    $scope.changeFloorplanChart = function(mode) {
      $scope.selectedFloorplanChart = mode;
    };

    $scope.isYearMode = function() {
      return $scope.selectedFloorplanChart === 'year';
    };

    $scope.isMonthMode = function() {
      return $scope.selectedFloorplanChart === 'month';
    };

    $scope.isWeekMode = function() {
      return $scope.selectedFloorplanChart === 'week';
    };

    $scope.onClickButtonLink = function(state) {
      $state.transitionTo(state);
    };

    $scope.viewDisbursementDetail = function(date) {
      var strUrl = api.contentLink('/report/disbursementdetail/' + date + ('/Disbursements-' + date /*filename*/), {});

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );
    };
  });
