'use strict';

angular.module('nextgearWebApp')
  .controller('TitleReleasesCtrl', function($scope, TitleReleases, Floorplan, $uibModal, dealerCustomerSupportPhone, gettextCatalog) {

    var uibModal = $uibModal;
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
        label: gettextCatalog.getString('View All'),
        value: TitleReleases.filterValues.ALL
      },
      {
        label: gettextCatalog.getString('Released'),
        value: TitleReleases.filterValues.OUTSTANDING
      },
      {
        label: gettextCatalog.getString('Eligible'),
        value: TitleReleases.filterValues.ELIGIBLE
      },
      {
        label: gettextCatalog.getString('Not Eligible'),
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
        filter: TitleReleases.filterValues.ALL,
        sortField: $scope.sortField,
        sortDesc: $scope.sortDescending
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
      return dealerCustomerSupportPhone.then(function (phoneNumber) {

        var value = phoneNumber.value;
        // format the phone number using the original formatting (xxx.yyy.zzzz).
        // TODO: need to find out how to print the phone number on a new line.
        var phoneElements = value.match(/([\d]{3})([\d]{3})([\d]{4})/);
        var customerSupportPhone = phoneElements[1] + '.' + phoneElements[2] + '.' + phoneElements[3];

        var title = gettextCatalog.getString('Title Release Unavailable'),
          message = gettextCatalog.getString('We\'re sorry, this title is unavailable for release at this time. If you would like more information about this title, please call Dealer Services at {{ phoneNumber }}.', { phoneNumber: customerSupportPhone }),
          buttons = [{label: gettextCatalog.getString('Close Window'), cssClass: 'btn-cta cta-primary'}];

        var dialogOptions = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl: 'views/modals/message-box.html',
          controller: 'MessageBoxCtrl',
          dialogClass: 'modal modal-medium',
          resolve: {
            title: function () {
              return title;
            },
            message : function() {
              return message;
            },
            buttons: function () {
              return buttons;
            }
          }
        };
        return uibModal.open(dialogOptions);
      });
    };

    $scope.titleReleaseLimitReached = function() {
      var title = gettextCatalog.getString('Title Release Limit Reached'),
          message = gettextCatalog.getString('The floor plan you have selected for title release would put you over the financial plan limits for this account.'),
          buttons = [{label: gettextCatalog.getString('Close Window'), cssClass: 'btn-cta cta-primary'}];

      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/message-box.html',
        controller: 'MessageBoxCtrl',
        dialogClass: 'modal modal-medium',
        resolve: {
          title: function () {
            return title;
          },
          message : function() {
            return message;
          },
          buttons: function () {
            return buttons;
          }
        }
      };

      return uibModal.open(dialogOptions);
    };

  });
