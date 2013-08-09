'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope) {

    $scope.isCollapsed = true;

    // dummy data
    $scope.payments = [{
      vin: 'CH224157',
      vehicle: '2008 Toyota Sequoia Limited Tan',
      stockNo: 1064,
      status: 'In Stock',
      dueDate: '6/10/2013',
      payoff: 23273.41,
      payment: 3544.49,
      title: 'NextGear',
      floorDate: '3/12/2013'
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

  });
