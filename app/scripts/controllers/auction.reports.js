'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionReportsCtrl', function($scope, api, segmentio, metric) {

    $scope.metric = metric; // make metric names available to template

    $scope.data = null;

    $scope.documents = [
      {
        'title': 'Credit Availability Query History (PDF)',
        'url': api.contentLink('/report/creditavailabilityqueryhistory', {})
      },
      {
        'title': 'Receivable Detail (PDF)',
        'url': api.contentLink('/report/getReceivableDetail', {})
      }
    ];

    $scope.viewDisbursementDetail = function() {

      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.disFormValidity = angular.copy($scope.disForm);

      if (!$scope.disForm.$valid) {
        return false;
      }

      var date = api.toShortISODate($scope.data.disDate);
      var strUrl = api.contentLink('/report/disbursementdetail/' + date, {});

      window.open(
        strUrl,
        '_blank'  // open a new window every time
      );

      segmentio.track(metric.VIEW_HISTORICAL_REPORT, {
        reportName: 'Disbursement Detail'
      });
    };


  });
