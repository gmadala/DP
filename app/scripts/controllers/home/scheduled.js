'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope) {

    $scope.isCollapsed = true;

    // dummy data
    $scope.schPayments = [{
      vin: 'CH224157',
      vehicle: '2008 Toyota Sequoia Limited Tan',
      stockNo: 1064,
      status: 'Pending',
      scheduledDate: '5/15/2013',
      payoff: 20864.24,
      curtailment: 274,
      setup: '5/10/2013',
      scheduledBy: 'Michael Bluth'
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

  });
