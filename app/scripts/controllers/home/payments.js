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
        value: Payments.filterValues.ALL
      },
      {
        label: 'Due Today',
        value: Payments.filterValues.TODAY
      },
      {
        label: 'Due This Week',
        value: Payments.filterValues.THIS_WEEK
      },
      {
        label: 'Date Range',
        value: Payments.filterValues.RANGE
      }
    ];

    $scope.search = function() {
      $scope.results = Payments.search($scope.searchCriteria);
    };

    $scope.resetSearch = function (initialFilter) {
      $scope.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Payments.filterValues.ALL
      };
      $scope.search();
    };

    $scope.resetSearch($stateParams.filter);

  });
