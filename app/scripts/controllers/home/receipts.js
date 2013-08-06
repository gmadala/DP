'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, Receipts) {

    $scope.isCollapsed = true;

    // This is a generic piece of data that maps to multiple API params
    $scope.keyword = null;

    // These are the query-string params the API accepts
    $scope.criteria = {
      ReceiptNumber:    null,
      Vin:              null,
      StartDate:        null,
      EndDate:          null,
      PaymentMethod:    null,
      CheckNumber:      null,
      PayeeDescription: null,
      StockNumber:      null,
      TransactionType:  null
    };

    // Run the search
    $scope.search = function() {

      // The search field could be any one of these:
      $scope.criteria.ReceiptNumber = $scope.keyword;
      $scope.criteria.StockNumber   = $scope.keyword;
      $scope.criteria.Vin           = $scope.keyword;
      $scope.criteria.CheckNumber   = $scope.keyword;

      Receipts.search($scope.criteria).then(
        function(results) { $scope.receipts = results.Receipts; },
        function(error) { $log.error(error); }
      );
    };

    // handle deep-link search param on URL
    if ($stateParams.search) {
      $scope.keyword = $stateParams.search;
      angular.extend($scope.criteria, {
        StartDate: null,
        EndDate: null,
        PaymentMethod: null
      });
      $scope.search();
    }
  });
