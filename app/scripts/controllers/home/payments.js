'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, Payments) {

    $scope.isCollapsed = true;

    // dummy data - payment queue
    $scope.queue = [{
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    },
    {
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    },
    {
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    }];
    $scope.total = 3544.49*3;
    $scope.fees=[{ type: 'Collateral Audit', payment: 150}];
    // end dummy data

    $scope.filterOptions = [
      {
        label: 'View All',
        value: 'all'
      },
      {
        label: 'Due Today',
        value: 'today'
      },
      {
        label: 'Due This Week',
        value: 'week'
      },
      {
        label: 'Date Range',
        value: 'range'
      }
    ];

    $scope.search = function(searchData) {
      $scope.results = Payments.search(searchData);
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
