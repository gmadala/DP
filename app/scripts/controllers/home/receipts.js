'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, Receipts, User) {

    $scope.isCollapsed = true;

    $scope.getReceiptStatus = function (receipt) {
      if (receipt.IsNsf) { return 'nsf'; }
      if (receipt.IsVoided) { return 'void'; }
      return 'normal';
    };

    $scope.filterOptions = []; // loaded below from User data

    $scope.receipts = {
      results: [],
      loading: false,
      paginator: null
    };

    $scope.receipts.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.receipts.paginator = null;
      $scope.receipts.results.length = 0;
      $scope.receipts.fetchNextResults();
    };

    $scope.receipts.fetchNextResults = function () {
      var paginator = $scope.receipts.paginator;
      if (paginator && !paginator.hasMore()) {
        return;
      }

      // get the next applicable batch of results
      $scope.receipts.loading = true;
      Receipts.search($scope.receipts.searchCriteria, paginator).then(
        function (result) {
          $scope.receipts.loading = false;
          $scope.receipts.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.receipts.results, result.Receipts);
        }, function (/*error*/) {
          $scope.receipts.loading = false;
        }
      );
    };

    $scope.receipts.resetSearch = function (initialKeyword) {
      $scope.receipts.searchCriteria = {
        query: initialKeyword || null,
        startDate: null,
        endDate: null,
        filter: $scope.filterOptions.length > 0 ? $scope.filterOptions[0].value : null
      };
      $scope.receipts.search();
    };

    // filters (by payment method) are data-driven - wait for them to be available post-login
    var unwatch = $scope.$watch(function () { return User.getStatics(); }, function (statics) {
      if (statics) {
        var filters = [],
          allIds = [];
        angular.forEach(statics.paymentMethods, function (method) {
          filters.push({
            label: method.Name,
            value: method.Id
          });
          allIds.push(method.Id);
        });
        // special View All filter is simply a list of all payment method ids
        filters.unshift({
          label: 'View All',
          value: allIds.join(',')
        });
        $scope.filterOptions = filters;
        $scope.receipts.resetSearch($stateParams.search);
        unwatch();
      }
    });

  });
