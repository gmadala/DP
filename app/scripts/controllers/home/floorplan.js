'use strict';

/**
 * WARNING: This controller is used for both dealer Floorplan AND auction Seller Floorplan. Understand
 * the ramifications to each view and test both when making any changes here!!
 */
angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams, Floorplan, User) {

    $scope.isCollapsed = true;

    $scope.getVehicleDescription = function (floorplan) {
      return [
        floorplan.UnitYear,
        floorplan.UnitMake,
        floorplan.UnitModel,
        floorplan.UnitStyle,
        floorplan.Color
      ].join(' ');
    };

    if (User.isDealer()) {
      $scope.filterOptions = [
        {
          label: 'View All',
          value: Floorplan.filterValues.ALL
        },
        {
          label: 'Pending',
          value: Floorplan.filterValues.PENDING
        },
        {
          label: 'Denied',
          value: Floorplan.filterValues.DENIED
        },
        {
          label: 'Approved',
          value: Floorplan.filterValues.APPROVED
        },
        {
          label: 'Completed',
          value: Floorplan.filterValues.COMPLETED
        }
      ];
    } else {
      // auction filters
      $scope.filterOptions = [
        {
          label: 'View All',
          value: Floorplan.filterValues.ALL
        },
        {
          label: 'Pending/Not Paid',
          value: Floorplan.filterValues.PENDING_NOT_PAID
        },
        {
          label: 'Denied/Not Paid',
          value: Floorplan.filterValues.DENIED_NOT_PAID
        },
        {
          label: 'Approved/Paid',
          value: Floorplan.filterValues.APPROVED_PAID
        },
        {
          label: 'Approved/Not Paid',
          value: Floorplan.filterValues.APPROVED_NOT_PAID
        },
        {
          label: 'Completed/Paid',
          value: Floorplan.filterValues.COMPLETED_PAID
        },
        {
          label: 'Completed/Not Paid',
          value: Floorplan.filterValues.COMPLETED_NOT_PAID
        },
        {
          label: 'No Title/Paid',
          value: Floorplan.filterValues.NO_TITLE_PAID
        }
      ];
    }

    $scope.data = {
      results: [],
      loading: false,
      paginator: null
    };

    $scope.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.results.length = 0;

      // commit the proposed search criteria
      $scope.searchCriteria = angular.copy($scope.proposedSearchCriteria);

      $scope.fetchNextResults();
    };

    $scope.fetchNextResults = function () {
      var paginator = $scope.data.paginator;
      if (paginator && !paginator.hasMore()) {
        return;
      }

      // get the next applicable batch of results
      $scope.data.loading = true;
      Floorplan.search($scope.searchCriteria, paginator).then(
        function (result) {
          $scope.data.loading = false;
          $scope.data.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.data.results, result.Floorplans);
        }, function (/*error*/) {
          $scope.data.loading = false;
        }
      );
    };

    $scope.resetSearch = function (initialFilter) {
      $scope.proposedSearchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Floorplan.filterValues.ALL
      };
      $scope.search();
    };

    $scope.resetSearch($stateParams.filter);

  });
