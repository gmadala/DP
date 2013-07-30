'use strict';

angular.module('nextgearWebApp')
  .controller('HomeCtrl', function($scope, $state, $stateParams) {
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;

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

    $scope.isCollapsed = true;

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

    $scope.receipts = [{
      vin: 'CH224157',
      vehicle: '2008 Toyota Sequoia Limited Tan',
      stockNo: '1064',
      status: 'Processed',
      payDate: '5/10/2013',
      applied: 20864.24,
      provided: 3181.60,
      receiptNo: 2146838,
      payment: 'ACH',
      checkNo: '',
      payee: ''
    }];

    $scope.floorplan = [{
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
    }]; // end dummy data

    $scope.openModal = function() {
      $scope.shouldBeOpen = true;
    };

    $scope.closeModal = function() {
      $scope.shouldBeOpen = false;
    };
  });
