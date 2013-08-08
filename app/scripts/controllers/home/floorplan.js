'use strict';

angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams) {

    $scope.isCollapsed = true;

    // TODO: handle filter param from dashboard to auto-search for a certain status (approved, pending, denied)
    console.log('requested filter:', $stateParams.filter);

    // dummy data
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
