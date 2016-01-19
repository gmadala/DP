'use strict';

angular.module('nextgearWebApp')
  .controller('RequestCreditIncreaseCtrl', function($scope, dialog, $modal, CreditIncrease, gettextCatalog, kissMetricInfo, segmentio, metric) {

    kissMetricInfo.getKissMetricInfo().then(
      function(result){
        segmentio.track(metric.VIEW_REQUEST_CREDIT_INCREASE_PAGE,result);
      }
    );

    $scope.loading = false;
    $scope.twoDecimalRegex = /^(\d)*(.(\d){0,2})?$/;

    $scope.selector = {
      selectedLineOfCredit: null,
      isTemporary: null,
      amount: null
    };

    $scope.loading = true;

    CreditIncrease.getActiveLinesOfCredit().then(function(lines) {
      $scope.loading = false;
      $scope.selector.linesOfCredit = lines;

      // If there is only one line of credit, auto-select that one.
      if ($scope.selector.linesOfCredit.length === 1) {
        $scope.selector.selectedLineOfCredit = $scope.selector.linesOfCredit[0];
      }
    });

    $scope.confirmRequest = function() {


      $scope.formValidation = angular.copy($scope.requestCreditIncreaseForm);
      if($scope.formValidation.$invalid) {
        return;
      }

      // For disabling inputs while sending request
      $scope.loading = true;
      CreditIncrease.requestCreditIncrease($scope.selector.selectedLineOfCredit.id, $scope.selector.isTemporary === 'true', parseFloat($scope.selector.amount)).then(
        // success
        function() {

          kissMetricInfo.getKissMetricInfo().then(function(result) {
            if ($scope.selector.isTemporary === 'true') {
              segmentio.track(metric.DEALER_TEMP_CREDIT_INCREASE_REQUEST_SUBMITTED_PAGE, result);
            } else {
              segmentio.track(metric.DEALER_PERMANENT_CREDIT_INCREASE_REQUEST_SUBMITTED, result);
            }
            $scope.kissMetricData = result;
          });

          $scope.loading = false;
          dialog.close(); // close request dialog

          // show success dialog
          var title = gettextCatalog.getString('Request a Credit Increase'),
            message = gettextCatalog.getString('Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.'),
            buttons = [{label: gettextCatalog.getString('Close Window'), cssClass: 'btn-cta cta-secondary'}];
          return $modal.messageBox(title, message, buttons).open();
        },
        // failure
        function() {
          $scope.loading = false;
        }
      );
    };

    $scope.close = dialog.close;

  });
