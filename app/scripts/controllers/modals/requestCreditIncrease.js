'use strict';

angular.module('nextgearWebApp')
  .controller('RequestCreditIncreaseCtrl', function($scope, dialog, $dialog, CreditIncrease) {
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
          $scope.loading = false;
          dialog.close(); // close request dialog

          // show success dialog
          var title = 'Request a Credit Increase',
            message = 'Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.',
            buttons = [{label: 'Close Window', cssClass: 'btn-cta cta-secondary'}];
          return $dialog.messageBox(title, message, buttons).open();
        },
        // failure
        function() {
          $scope.loading = false;
        }
      );
    };

    $scope.close = dialog.close;

  });
