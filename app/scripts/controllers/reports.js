'use strict';

angular.module('nextgearWebApp')
  .controller('ReportsCtrl', function($scope, api, segmentio, metric, moment, gettextCatalog) {

    /***
     * The last URI route param of the report endpoints is used so browsers can get it as a default filename
     * when saving the report PDF.
     */

    $scope.metric = metric; // make metric names available to template
    segmentio.track(metric.VIEW_VIEW_A_REPORT_PAGE);

    $scope.data = null;

    $scope.expInvStatus = {
      'type': 'select',
      'value': gettextCatalog.getString('All'),
      'values': [
        gettextCatalog.getString('All'),
        gettextCatalog.getString('Approved'),
        gettextCatalog.getString('Completed'),
        gettextCatalog.getString('Denied'),
        gettextCatalog.getString('Voided')
      ]
    };

    $scope.currentReports = [
      {
        'title': gettextCatalog.getString('Receivable Detail (PDF)'),
        'url': api.contentLink('/report/getReceivableDetail/ReceivableDetail', {})
      }
    ];

    $scope.vinRegexp = /^[A-Za-z0-9]*$/;

    $scope.viewDealerStatement = function() {
      var startDate = api.toShortISODate($scope.data.stmtStartDate);
      var endDate = api.toShortISODate($scope.data.stmtEndDate);

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.stmtFormValidity = angular.copy($scope.stmtForm);
      $scope.stmtFormValidity.dateRangeError = startDate && endDate && moment(startDate).isAfter(endDate);

      if (!$scope.stmtForm.$valid || $scope.stmtFormValidity.dateRangeError) {
        return false;
      }

      var strUrl = '/report/dealerstatement/' + startDate + '/' + endDate;
      var defaultFilename = '/DealerStatement_' + startDate + '_to_' + endDate;

      strUrl +=  defaultFilename;

      // append the vin filter string if one was provided, encoding it for safe transit in a GET query
      if ($scope.data.stmtVinFilter) {
        var encodedVin = encodeURIComponent($scope.data.stmtVinFilter);
        strUrl += 'forVin_' + encodedVin + '/' + encodedVin;
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
        '/report/disbursementdetail/' + date + ('/Disbursements_' + date /*filename*/),
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
      var startDate = api.toShortISODate($scope.data.paidOffStartDate);
      var endDate = api.toShortISODate($scope.data.paidOffEndDate);

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.paidOffFormValidity = angular.copy($scope.paidOffForm);
      $scope.paidOffFormValidity.dateRangeError = startDate && endDate && moment(startDate).isAfter(endDate);

      if (!$scope.paidOffForm.$valid || $scope.paidOffFormValidity.dateRangeError) {
        return false;
      }

      var params = {};
      var defaultFilename = '/PaidOff_' + startDate + '_to_' + endDate;

      if ($scope.data.paidOffVinFilter) {
        var encodedVin = encodeURIComponent($scope.data.paidOffVinFilter);
        params.VIN = encodedVin;
        defaultFilename += '_vin_' + encodedVin;
      }

      if ($scope.data.stockNos) {
        params.stockNumber = $scope.trimCommasAndWhitespace( $scope.data.stockNos );
        defaultFilename += '_stockNumber_' + params.stockNumber;
      }
      else if ($scope.data.rangeStart || $scope.data.rangeEnd) {
        params.stockNumber = $scope.data.rangeStart + '-' + $scope.data.rangeEnd;
        defaultFilename += '_stockNumbers_' + params.stockNumber;
      }

      var strUrl = api.contentLink(
        '/report/paidoffsummary/' + startDate + '/' + endDate + defaultFilename,
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
        '/report/getupcomingcurtailmentpayments/' + date + '/CurtailmentPaymentsUntil_' + date,
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

    $scope.viewExpInv = function() {
      // grab params, build url string and open window with report.
      var stat = $scope.expInvStatus.value;
      var strUrl = api.contentLink(
        '/report/inventorydetail/' + stat + '/InventoryDetails_' + stat,
        {}
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_CURRENT_REPORT, {
        reportName: 'Exportable Inventory'
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
