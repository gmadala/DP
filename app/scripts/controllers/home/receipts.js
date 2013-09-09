'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, Receipts) {

    $scope.isCollapsed = true;

    $scope.filterOptions = [
      {
        label: 'View All',
        value: 'all'
      },
      {
        label: 'Auction Check',
        value: 'ach'
      },
      {
        label: 'Certified Funds',
        value: 'certified'
      },
      {
        label: 'Check',
        value: 'check'
      },
      {
        label: 'CPP Claim',
        value: 'cpp'
      },
      {
        label: 'Non Dealer Check',
        value: 'nondealerCheck'
      },
      {
        label: 'Proceeds',
        value: 'proceeds'
      }
    ];

    $scope.search = function() {
      $scope.results = Receipts.search($scope.searchCriteria);
    };

    $scope.resetSearch = function (initialKeyword) {
      $scope.searchCriteria = {
        query: initialKeyword || null,
        startDate: null,
        endDate: null,
        filter: 'all'
      };
      $scope.search();
    };

    $scope.resetSearch($stateParams.search);

  });
