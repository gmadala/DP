'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionSellerFloorplanCtrl', function($scope, $dialog) {

    $scope.filterOptions = [
      {
        label: 'View All',
        value: 'all'
      },
      {
        label: 'Pending/Not Paid',
        value: 'pending'
      },
      {
        label: 'Denied/Not Paid',
        value: 'denied'
      },
      {
        label: 'Approved/Paid',
        value: 'approvedPaid'
      },
      {
        label: 'Approved/Not Paid',
        value: 'approvedNotPaid'
      },
      {
        label: 'Completed/Paid',
        value: 'completedPaid'
      },
      {
        label: 'Completed/Not Paid',
        value: 'completedNotPaid'
      },
      {
        label: 'No Title/Paid',
        value: 'noTitlePaid'
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
