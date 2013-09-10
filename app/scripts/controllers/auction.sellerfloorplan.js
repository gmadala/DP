'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionSellerFloorplanCtrl', function($scope, $dialog, Floorplan) {

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

    $scope.search = function() {
      $scope.searchResults = [1, 2, 3]; // TODO: Fetch data
    };

    $scope.resetSearch = function (initialFilter) {
      $scope.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || 'all'
      };
      $scope.search();
    };

    $scope.resetSearch();

    $scope.openEditTitle = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/editTitle.html',
        controller: 'EditTitleCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };

  });
