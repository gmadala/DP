'use strict';

angular.module('nextgearWebApp')
  .controller('ReportsCtrl', function($scope, api) {

    $scope.data = null;

    $scope.currentReports = [
      { 'title': 'Receivable Detail (PDF)',
        'url': '/report/getReceivableDetail'
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

    $scope.viewPaidOffSummary = function() {

          // take a snapshot of form state -- view can bind to this for submit-time update of validation display
          $scope.paidOffFormValidity = angular.copy($scope.paidOffForm);

          if (!$scope.paidOffForm.$valid) {
            return false;
          }

          var startDate = api.toShortISODate($scope.data.paidOffStartDate);
          var endDate = api.toShortISODate($scope.data.paidOffEndDate);

          var strUrl = 'report/paidoffsumary?startDate=' + startDate + '&endDate=' + endDate;

          if ($scope.data.paidOffVinFilter) {
            strUrl += '&VIN=' + encodeURIComponent($scope.data.paidOffVinFilter);
          }

          if ($scope.data.stockNos) {
            strUrl += 'stockNumber=' + $scope.trimCommasAndWhitespace( $scope.data.stockNos );
          }
          else if ($scope.data.rangeStart || $scope.data.rangeEnd) {
            strUrl += 'stockNumber=' + $scope.data.rangeStart;
            if ($scope.data.rangeEnd) {
              strUrl += '-' + $scope.data.rangeEnd;
            }
          }

          window.open(
            strUrl,
            '_blank'  // open a new window every time
          );

        };

    $scope.viewCurtailment = function() {

          // take a snapshot of form state -- view can bind to this for submit-time update of validation display
          $scope.curtailmentFormValidity = angular.copy($scope.curtailmentForm);

          if (!$scope.curtailmentForm.$valid) {
            return false;
          }

          var date = api.toShortISODate($scope.data.curtailmentDate);
          var strUrl = 'report/getupcomingcurtailmentpayments/' + date;

          console.log(strUrl);

          window.open(
            strUrl,
            '_blank'  // open a new window every time
          );
        };


    $scope.trimCommasAndWhitespace = function(value) {

          var parts = value.split(',');

          _.each(
            parts,
            function(el, i, list) {
                list[i] = el.trim();
              }
          );

          return parts.join(',');

        };
  });
