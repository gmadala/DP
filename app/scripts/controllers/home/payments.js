'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, Payments) {

    $scope.isCollapsed = true;

    // dummy data
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

    $scope.filter = $stateParams.filter;

    $scope.searchData = {
      Criteria: null,
      DueDateStart: null,
      DueDateEnd: null
    };

    $scope.search = function(searchData) {
      $scope.payments = Payments.search(searchData);
    };
  });
