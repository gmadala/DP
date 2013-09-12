'use strict';

angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams, Floorplan) {

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

    $scope.data = {
      results: [],
      loading: false,
      paginator: null
    };

    $scope.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.results.length = 0;
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
      $scope.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Floorplan.filterValues.ALL
      };
      $scope.search();
    };

    $scope.resetSearch($stateParams.filter);

  });
