'use strict';

angular.module('nextgearWebApp')
  .controller('RequestCreditIncreaseCtrl', function($scope, dialog, $dialog, CreditIncrease) {
    $scope.loading = false;
    $scope.twoDecimalRegex = /^(\d)*(.(\d){0,2})?$/;

    $scope.selector = {
      linesOfCredit: CreditIncrease.getActiveLinesOfCredit(),
      selectedLineOfCredit: null,
      isTemporary: null,
      amount: null
    };

    $scope.confirmRequest = function() {

      $scope.formValidation = angular.copy($scope.requestCreditIncreaseForm);
      if($scope.formValidation.$invalid) {
        return;
      }

      // For disabling inputs while sending request
      $scope.loading = true;
      CreditIncrease.requestCreditIncrease($scope.selector.selectedLineOfCredit.id, $scope.selector.isTemporary === 'true', parseFloat($scope.selector.amount)).then(function() {
        $scope.loading = false;
        return dialog.close();
      }).then(function(){
        var title = 'Request a Credit Increase',
            message = 'Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.',
            buttons = [{label: 'Close Window', cssClass: 'btn btn-mini btn-primary'}];

        return $dialog.messageBox(title, message, buttons).open();
      });
    };

    $scope.close = dialog.close;

  });
