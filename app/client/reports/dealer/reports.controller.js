(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ReportsCtrl', ReportsCtrl);

  ReportsCtrl.$inject = ['$scope', 'api', 'segmentio', 'metric', 'moment', 'gettextCatalog', 'kissMetricInfo'];

  function ReportsCtrl($scope, api, segmentio, metric, moment, gettextCatalog, kissMetricInfo) {

    /***
     * The last URI route param of the report endpoints is used so browsers can get it as a default filename
     * when saving the report PDF.
     */

    $scope.metric = metric; // make metric names available to template

    $scope.data = null;

    $scope.dateFormat = 'MM/dd/yyyy';
    $scope.dealerStartDatePicker = {
      opened: false
    };
    $scope.dealerEndDatePicker = {
      opened: false
    };
    $scope.upcomingDatePicker = {
      opened: false
    };
    $scope.disbursementDatePicker = {
      opened: false
    };
    $scope.openDealerStartDatePicker = function() {
      $scope.dealerStartDatePicker.opened = true;
    };
    $scope.openDealerEndDatePicker = function() {
      $scope.dealerEndDatePicker.opened = true;
    };
    $scope.openUpcomingDatePicker = function() {
      $scope.upcomingDatePicker.opened = true;
    };
    $scope.openDisbursementDatePicker = function() {
      $scope.disbursementDatePicker.opened = true;
    };
    $scope.paidStartDatePicker = {
      opened: false
    };
    $scope.paidEndDatePicker = {
      opened: false
    };
    $scope.openPaidStartDatePicker = function() {
      $scope.paidStartDatePicker.opened = true;
    };
    $scope.openPaidEndDatePicker = function() {
      $scope.paidEndDatePicker.opened = true;
    };

    $scope.labelUpcomingDate = gettextCatalog.getString('Date');

    $scope.updateUpcomingDate = function(newDate) {
      $scope.data.curtailmentDate = newDate;
    };

    $scope.maxDate = new Date();

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

    kissMetricInfo.getKissMetricInfo().then(function(result){
      $scope.kissMetricData = result;
    });

    $scope.currentReports = [
      {
        'title': gettextCatalog.getString('Receivable Detail (PDF)'),
        'url': api.contentLink('/report/getReceivableDetail/ReceivableDetail', {}),
        'metric': metric.DEALER_REPORTS_RECEIVABLE_DETAIL
      }
    ];

    $scope.vinRegexp = /^[A-Za-z0-9]*$/;

    $scope.viewDealerStatement = function() {
      var startDate = api.toShortISODate($scope.data.stmtStartDate);
      var endDate = api.toShortISODate($scope.data.stmtEndDate);

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.stmtFormValidity = angular.copy($scope.stmtForm);
      $scope.stmtFormValidity.dateRangeError = startDate && endDate && moment(startDate).isAfter(endDate);
      $scope.stmtFormValidity.endDateRangeError =  moment(endDate).isAfter(moment($scope.maxDate));

      if (!$scope.stmtForm.$valid || $scope.stmtFormValidity.dateRangeError || $scope.stmtFormValidity.endDateRangeError) {
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

      kissMetricInfo.getKissMetricInfo().then(
        function(result){
          segmentio.track(metric.DEALER_REPORT_DEALER_STATEMENT, result);
        }
      );

      window.open(
        api.contentLink(strUrl, {}),
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
      var strUrl = api.contentLink(
        '/report/disbursementdetail/' + date + ('/Disbursements_' + date /*filename*/),
        {}
      );

      kissMetricInfo.getKissMetricInfo().then(
        function(result){
          segmentio.track(metric.DEALER_REPORTS_DISBURSEMENT_DETAIL, result);
        }
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );
    };

    $scope.viewPaidOffSummary = function() {
      var startDate = api.toShortISODate($scope.data.paidOffStartDate);
      var endDate = api.toShortISODate($scope.data.paidOffEndDate);

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.paidOffFormValidity = angular.copy($scope.paidOffForm);
      $scope.paidOffFormValidity.dateRangeError = startDate && endDate && moment(startDate).isAfter(endDate);
      $scope.paidOffFormValidity.endDateRangeError =  moment(endDate).isAfter(moment($scope.maxDate));

      if (!$scope.paidOffForm.$valid || $scope.paidOffFormValidity.dateRangeError  || $scope.paidOffFormValidity.endDateRangeError ) {
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

      kissMetricInfo.getKissMetricInfo().then(
        function(result){
          segmentio.track(metric.DEALER_REPORTS_PAID_OFF_SUMMARY, result);
        }
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );
    };

    $scope.viewCurtailment = function() {

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.curtailmentFormValidity = angular.copy($scope.curtailmentForm);
      $scope.invalidUpcomingDate = $scope.curtailmentFormValidity.curtailmentDate.$error.required || $scope.curtailmentFormValidity.curtailmentDate.$error.date;
      if (!$scope.curtailmentForm.$valid) {
        return false;
      }

      var date = api.toShortISODate($scope.data.curtailmentDate);
      var strUrl = api.contentLink(
        '/report/getupcomingcurtailmentpayments/' + date + '/CurtailmentPaymentsUntil_' + date,
        {}
      );

      kissMetricInfo.getKissMetricInfo().then(
        function(result){
          segmentio.track(metric.DEALER_REPORTS_UPCOMING_CURTAILMENT_PAYOFF_QUOTE, result);
        }
      );

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );
    };

    $scope.viewExpInv = function() {
      // grab params, build url string and open window with report.
      var stat = $scope.expInvStatus.value;
      var strUrl = api.contentLink(
        '/report/inventorydetail/' + stat + '/InventoryDetails_' + moment().format('YYYYMMDDhmmss'),
        {}
      );

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

  }
})();
