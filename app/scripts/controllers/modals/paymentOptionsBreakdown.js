'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, payment) {

  $scope.payment = payment;
  console.log(payment);

  // $scope.maxAdditional = payment.


  $scope.selector = {
    paymentOption: payment.isPayoff ? 'payoff' : 'curtailment',
    additionalAmount: null
  };

  $scope.close = function() {
    dialog.close();
  };

  $scope.confirm = function() {

  };

});
