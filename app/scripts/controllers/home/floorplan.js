'use strict';

/**
 * WARNING: This controller is used for both dealer Floorplan AND auction Seller Floorplan. Understand
 * the ramifications to each view and test both when making any changes here!!
 */
angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams, Floorplan, User, metric, $timeout) {

    $scope.metric = metric; // make metric names available to templates

    $scope.isCollapsed = true;

    var isDealer = User.isDealer(),
        lastPromise;

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;

    if (isDealer) {
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
      paginator: null,
      hitInfiniteScrollMax: false
    };

    $scope.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.hitInfiniteScrollMax = false;
      $scope.data.results.length = 0;

      // commit the proposed search criteria
      $scope.searchCriteria = angular.copy($scope.proposedSearchCriteria);

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

      $scope.proposedSearchCriteria.sortField = $scope.sortField;
      $scope.proposedSearchCriteria.sortDesc = $scope.sortDescending;

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
      promise = lastPromise = Floorplan.search($scope.searchCriteria, paginator);
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

    $scope.sellerTimeouts = {};

    $scope.sellerHasTitle = function(floorplan, hasTitle) {
      /*jshint camelcase: false */
      var curFloorplan = angular.element('#' + floorplan.FloorplanId + '+ label');

      var toggleTooltip = function(possibleTT, hide) {
        if(possibleTT.hasClass('tooltip')) {
          // the tooltip div exists, so we need to make sure its
          // completely gone or properly brought back
          var displayVal = hide ? 'none' : '';
          possibleTT.css('display', displayVal);
        }
      };

      // prevent flash of tooltip when "i have title" is unchecked
      curFloorplan.scope().tt_isOpen = false;
      toggleTooltip(curFloorplan.next(), true);

      Floorplan.sellerHasTitle(floorplan.FloorplanId, hasTitle).then(
        function() {
          if (hasTitle) { // show the tooltip for 5 seconds, then fade
            curFloorplan.scope().tt_isOpen = true;
            toggleTooltip(curFloorplan.next(), false);

            if ($scope.sellerTimeouts[floorplan.FloorplanId]) {
              // cancel any previous timeouts before setting a new one.
              $timeout.cancel($scope.sellerTimeouts[floorplan.FloorplanId]);
            }

            $scope.sellerTimeouts[floorplan.FloorplanId] = $timeout(function() {
              curFloorplan.scope().tt_isOpen = false;
              toggleTooltip(curFloorplan.next(), true);
            }, 5000);
          }

          // real purpose of this function
          floorplan.TitleLocation = hasTitle ? 'Seller' : 'Title Absent';
        }
      );
    };
  });
