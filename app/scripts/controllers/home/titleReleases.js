'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleasesCtrl', function($scope, TitleReleases, Floorplan, metric, $dialog) {

    $scope.metric = metric; // make metric names available to templates

    $scope.isCollapsed = true;

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;
    $scope.isFloorplanOnQueue = TitleReleases.isFloorplanOnQueue;
    TitleReleases.getTitleReleaseEligibility().then(function(eligibility) {
      $scope.eligibility = eligibility;
    });
    $scope.eligibilityLoading = TitleReleases.getEligibilityLoading;


    $scope.queueLength = function() {
      return TitleReleases.getQueue().length;
    };

    var lastPromise;

    $scope.searchParams = {
      proposedSearchCriteria: {
        query: null,
        startDate: null,
        endDate: null,
        filter: TitleReleases.filterValues.ALL
      }
    };

    $scope.data = {
      results: [],
      loading: false,
      paginator: null,
      hitInfiniteScrollMax: false
    };

    $scope.filterOptions = [
      {
        label: 'View All',
        value: TitleReleases.filterValues.ALL
      },
      {
        label: 'Outstanding Dealer Requested Title Releases',
        value: TitleReleases.filterValues.OUTSTANDING
      },
      {
        label: 'Eligible for Title Release',
        value: TitleReleases.filterValues.ELIGIBLE
      },
      {
        label: 'Not Eligible for Title Release',
        value: TitleReleases.filterValues.NOT_ELIGIBLE
      }
    ];

    $scope.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.hitInfiniteScrollMax = false;
      $scope.data.results.length = 0;

      // commit the proposed search criteria
      $scope.searchCriteria = angular.copy($scope.searchParams.proposedSearchCriteria);

      $scope.fetchNextResults();
    };

    $scope.sortField = 'FlooringDate';

    $scope.sortBy = function (fieldName) {
      if ($scope.sortField === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.sortDescending = !$scope.sortDescending;
      } else {
        $scope.sortField = fieldName;
        $scope.sortDescending = false;
      }

      $scope.searchParams.proposedSearchCriteria.sortField = $scope.sortField;
      $scope.searchParams.proposedSearchCriteria.sortDesc = $scope.sortDescending;

      $scope.search();
    };

    $scope.fetchNextResults = function () {
      var paginator = $scope.data.paginator,
          promise;

      if (paginator && !paginator.hasMore()) {
        if (paginator.hitMaximumLimit()) {
          $scope.data.hitInfiniteScrollMax = true;
        }
        return;
      }

      // get the next applicable batch of results
      $scope.data.loading = true;
      promise = lastPromise = TitleReleases.search($scope.searchCriteria, paginator);
      promise.then(
        function (result) {
          if (promise !== lastPromise) { return; }
          $scope.data.loading = false;
          $scope.data.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.data.results, result.Floorplans);
        }, function (/*error*/) {
          if (promise !== lastPromise) { return; }
          $scope.data.loading = false;
        }
      );

    };

    $scope.resetSearch = function () {
      $scope.searchParams.proposedSearchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: TitleReleases.filterValues.ALL
      };
      $scope.search();
    };

    $scope.resetSearch();

    $scope.toggleSelected = function (floorplan) {
      if(TitleReleases.isFloorplanOnQueue(floorplan)) {
        TitleReleases.removeFromQueue(floorplan);
      } else if(TitleReleases.getQueueFinanced() + floorplan.AmountFinanced <= $scope.eligibility.ReleaseBalanceAvailable) {
        TitleReleases.addToQueue(floorplan);
      } else {
        // Not enough credit to request title
        $scope.titleReleaseLimitReached();
      }
    };

    $scope.titleReleaseUnavailable = function() {
      var title = 'Title Release Unavailable',
          message = 'We\'re sorry, this title is unavailable for release at this time. If you would like more information about this title, please call Dealer Services at 888.989.3721.',
          buttons = [{label: 'Close Window', cssClass: 'btn btn-mini btn-primary'}];

      return $dialog.messageBox(title, message, buttons).open();
    };

    $scope.titleReleaseLimitReached = function() {
      var title = 'Title Release Limit Reached',
          message = 'The floor plan you have selected for title release would put you over the financial plan limits for this account.',
          buttons = [{label: 'Close Window', cssClass: 'btn btn-mini btn-primary'}];

      return $dialog.messageBox(title, message, buttons).open();
    };

  });
