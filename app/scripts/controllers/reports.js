'use strict';

angular.module('nextgearWebApp')
  .controller('ReportsCtrl', function($scope, api, segmentio, metric) {

    $scope.metric = metric; // make metric names available to template

    $scope.data = null;

    $scope.currentReports = [
      {
        'title': 'Receivable Detail (PDF)',
        'url': api.contentLink('/report/getReceivableDetail', {})
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

      var strUrl = '/report/dealerstatement/' + startDate + '/' + endDate;

      // append the vin filter string if one was provided, encoding it for safe transit in a GET query
      if ($scope.data.stmtVinFilter) {
        strUrl += '/' + encodeURIComponent($scope.data.stmtVinFilter);
      }

      window.open(
        api.contentLink(strUrl, {}),
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_HISTORICAL_REPORT, {
        reportName: 'Dealer Statement'
      });

    };

    $scope.viewDisbursementDetail = function() {

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.disFormValidity = angular.copy($scope.disForm);

      if (!$scope.disForm.$valid) {
        return false;
      }

      var date = api.toShortISODate($scope.data.disDate);
      var strUrl = api.contentLink(
        '/report/disbursementdetail/' + date,
        {}
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_HISTORICAL_REPORT, {
        reportName: 'Disbursement Detail'
      });
    };

    $scope.viewPaidOffSummary = function() {

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.paidOffFormValidity = angular.copy($scope.paidOffForm);

      if (!$scope.paidOffForm.$valid) {
        return false;
      }

      var startDate = api.toShortISODate($scope.data.paidOffStartDate);
      var endDate = api.toShortISODate($scope.data.paidOffEndDate);

      var params = {};

      if ($scope.data.paidOffVinFilter) {
        params.VIN = encodeURIComponent($scope.data.paidOffVinFilter);
      }

      if ($scope.data.stockNos) {
        params.stockNumber = $scope.trimCommasAndWhitespace( $scope.data.stockNos );
      }
      else if ($scope.data.rangeStart || $scope.data.rangeEnd) {
        params.stockNumber = $scope.data.rangeStart + '-' + $scope.data.rangeEnd;
      }

      var strUrl = api.contentLink(
        '/report/paidoffsummary/' + startDate + '/' + endDate,
        params
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_HISTORICAL_REPORT, {
        reportName: 'Paid off Summary'
      });
    };

    $scope.viewCurtailment = function() {

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.curtailmentFormValidity = angular.copy($scope.curtailmentForm);

      if (!$scope.curtailmentForm.$valid) {
        return false;
      }

      var date = api.toShortISODate($scope.data.curtailmentDate);
      var strUrl = api.contentLink(
        '/report/getupcomingcurtailmentpayments/' + date,
        {}
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_CURRENT_REPORT, {
        reportName: 'Upcoming Curtailment / Payoff Quote (PDF)'
      });
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
