'use strict';

angular.module('nextgearWebApp')
  .controller('ReportsCtrl', function($scope, api) {

    $scope.data = null;

    $scope.currentReports = [
      { 'title': 'Credit Availability Report (PDF)',
        'date': 'MMDDYYYY',
        'url': 'path/to/link'
      },
      { 'title': 'Receivable Detail (PDF)',
        'date': 'MMDDYYYY',
        'url': 'path/to/link'
      },
      { 'title': 'Upcoming Curtailment / Payoff Quote (PDF)',
        'date': 'MMDDYYYY',
        'url': 'path/to/link'
      }
    ];

    $scope.viewDealerStatement = function() {

          // take a snapshot of form state -- view can bind to this for submit-time update of validation display
          $scope.stmtFormValidity = angular.copy($scope.stmtForm);

          if (!$scope.stmtForm.$valid) {
            return false;
          }

          var startDate = api.toShortISODate($scope.data.stmtStartDate);
          var endDate = api.toShortISODate($scope.data.stmtEndDate);

          var strUrl = 'report/dealerstatement/' + startDate + '/' + endDate;

          // append the vin filter string if one was provided, encoding it for safe transit in a GET query
          if ($scope.data.stmtVinFilter) {
            strUrl += '/' + encodeURIComponent($scope.data.stmtVinFilter);
          }

          window.open(
            strUrl,
            '_blank'  // open a new window every time
          );

        };

    $scope.viewDisbursementDetail = function() {

          // take a snapshot of form state -- view can bind to this for submit-time update of validation display
          $scope.disFormValidity = angular.copy($scope.disForm);

          if (!$scope.disForm.$valid) {
            return false;
          }

          var date = api.toShortISODate($scope.data.disDate);
          var strUrl = 'report/disbursementdetail/' + date;

          window.open(
            strUrl,
            '_blank'  // open a new window every time
          );

        };
  });
