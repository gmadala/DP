'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionReportsCtrl', function ($scope, api, segmentio, metric, User, gettextCatalog) {
    /***
     * The last URI route param of the report endpoints is used so browsers can get it as a default filename
     * when saving the report PDF.
     */
    $scope.metric = metric; // make metric names available to template

    $scope.data = null;
    $scope.isManufacturer = User.isManufacturer() ;

    $scope.documents = [
      {
        'title': gettextCatalog.getString('Credit Availability Query History (PDF)'),
        'url': api.contentLink('/report/creditavailabilityqueryhistory/CreditAvailability', {})
      },
      {
        'title': gettextCatalog.getString('Receivable Detail (PDF)'),
        'url': api.contentLink('/report/getReceivableDetail/ReceivableDetail', {})
      }
    ];

    if($scope.isManufacturer){
      $scope.documents.push({
        'title': gettextCatalog.getString('Manufacturer Aging Report (PDF)'),
        'url': api.contentLink('/report/getAgingReportDetail/ManufacturerAgingReport', {})
      });
    }

    // set the subsidiary options
    User.getInfo().then(function(info) {
      $scope.subsidiaries = info.ManufacturerSubsidiaries || [];
      $scope.selectedSubsidiary = $scope.subsidiaries.length > 0 ? $scope.subsidiaries[0] : null;
      $scope.businessId = info.BusinessId;
    });

    $scope.viewDisbursementDetail = function () {
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.disFormValidity = angular.copy($scope.disForm);

      if (!$scope.disForm.$valid) {
        return false;
      }

      var businessId, businessName;
      var reportDate = api.toShortISODate($scope.data.disDate);

      if ($scope.selectedSubsidiary) {
        businessId = $scope.selectedSubsidiary.BusinessId;
        businessName = '-' + $scope.selectedSubsidiary.BusinessName.replace(/\W+/g, ''); // remove non-alphanumeric
      }
      else {
        businessId = $scope.businessId;
        businessName = '';
      }

      var strUrl =
        api.contentLink('/report/disbursementdetail/v1_1/' +
          reportDate + '/' +
          businessId +
          ('/Disbursements-' + reportDate + businessName /*filename*/), {});

      window.open(strUrl, '_blank'); // open a new window every time

      segmentio.track(metric.VIEW_HISTORICAL_REPORT, {
        reportName: 'Disbursement Detail'
      });
    };
  });
