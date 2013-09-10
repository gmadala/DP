'use strict';

angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams, Floorplan) {

    $scope.isCollapsed = true;

    $scope.filterOptions = [
      {
        label: 'View All',
        value: Floorplan.filterValues.ALL
      },
      {
        label: 'Pending',
        value: Floorplan.filterValues.PENDING
      },
      {
        label: 'Denied',
        value: Floorplan.filterValues.DENIED
      },
      {
        label: 'Approved',
        value: Floorplan.filterValues.APPROVED
      },
      {
        label: 'Completed',
        value: Floorplan.filterValues.COMPLETED
      }
    ];

    $scope.search = function() {
      // dummy data
      $scope.results = [{
        vin: 'CH224157',
        vehicle: '2008 Toyota Sequoia Limited Tan',
        stockNo: '1064',
        status: 'Processed',
        purchased: '5/10/2013',
        lastPay: '6/1/2013',
        titleRelease: '5/15/2013',
        releasedTo: 'Buyer',
        floored: '5/10/2013',
        seller: 'MAFS Pennsylvania'
      }];
    };

    $scope.resetSearch = function (initialFilter) {
      $scope.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || 'all'
      };
      $scope.search();
    };

    $scope.resetSearch($stateParams.filter);

  });
