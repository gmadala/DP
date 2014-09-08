'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, payment) {

  $scope.payment = payment;
  $scope.maxAdditional = payment.amounts.CurrentPayoff - payment.amounts.AmountDue;
  $scope.paymentBreakdown = {};

  $scope.selector = {
    paymentOption: payment.isPayoff ? 'payoff' : 'curtailment',
    additionalAmount: 0
  };


  $scope.$watch('selector.paymentOption', function(newVal) {
    if(newVal === 'payoff') {
      $scope.paymentBreakdown = {
        principal: payment.amounts.PrincipalPayoff,
        interest: payment.amounts.InterestPayoffTotal,
        fees: payment.amounts.FeesPayoffTotal,
        collateralProtection: payment.amounts.CollateralProtectionPayoffTotal,
        // total: payment.amounts.PrincipalPayoff + payment.amounts.InterestPayoffTotal + payment.amounts.FeesPayoffTotal + payment.amounts.CollateralProtectionPayoffTotal + $scope.selector.additionalAmount
      };
    } else if (newVal === 'curtailment') {
      $scope.paymentBreakdown = {
        principal: payment.amounts.PrincipalDue,
        interest: payment.amounts.InterestPaymentTotal,
        fees: payment.amounts.FeesPaymentTotal,
        collateralProtection: payment.amounts.CollateralProtectionPaymentTotal,
        // total: payment.amounts.PrincipalDue + payment.amounts.InterestPaymentTotal + payment.amounts.FeesPaymentTotal + payment.amounts.CollateralProtectionPaymentTotal + $scope.selector.additionalAmount
      };
    }
  });

  // $scope.getTotal = function() {
    // return $scope.paymentBreakdown.principal + $scope.paymentBreakdown.interest + $scope.paymentBreakdown.fees + $scope.paymentBreakdown.collateralProtection + $scope.selector.additionalAmount;
  // }

  $scope.$watch('selector.additionalAmount', function(newVal) {
    $scope.total = $scope.paymentBreakdown.principal + $scope.paymentBreakdown.interest + $scope.paymentBreakdown.fees + $scope.paymentBreakdown.collateralProtection + newVal;
  });

  $scope.total = $scope.paymentBreakdown.principal + $scope.paymentBreakdown.interest + $scope.paymentBreakdown.fees + $scope.paymentBreakdown.collateralProtection + $scope.selector.additionalAmount;


// $scope.$watch('selector.additionalAmount', function(newVal) {
//   $scope.paymentBreakdown
// })

  $scope.close = function() {
    dialog.close();
  };

  $scope.confirm = function() {

  };

});
