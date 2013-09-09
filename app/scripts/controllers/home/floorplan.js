'use strict';

angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams) {

    $scope.isCollapsed = true;

    $scope.filterOptions = [
      {
        label: 'View All',
        value: 'all'
      },
      {
        label: 'Pending',
        value: 'pending'
      },
      {
        label: 'Denied',
        value: 'denied'
      },
      {
        label: 'Approved',
        value: 'approved'
      },
      {
        label: 'Completed',
        value: 'completed'
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

      $scope.curtailment = [{
        startDate: '6/5/2013',
        dueDate: '8/5/2013',
        principal: 10216.40,
        principalPay: 1135.15,
        interest: 34.52,
        cpp: 87.79,
        fees: 0,
        totalPay: 1317.46,
        highlight: ''
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
