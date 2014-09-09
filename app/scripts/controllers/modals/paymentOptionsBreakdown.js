'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, cartItem) {

  $scope.cartItem = cartItem; // just for displaying values in the view.
  $scope.maxAdditional = cartItem.payoff.amount - cartItem.payment.amount;
  $scope.paymentBreakdown = {};
  $scope.total = 0;

  $scope.selector = {
    paymentOption: cartItem.isPayoff ? 'payoff' : 'payment',
    additionalAmount: cartItem.payment.additionalPrincipal || null
  };

  $scope.$watch('selector.paymentOption', function(newVal) {
    if(newVal === 'payoff') {
      $scope.paymentBreakdown = cartItem.payoff;
    } else if (newVal === 'payment') {
      $scope.paymentBreakdown = cartItem.payment;
    }
    $scope.total = $scope.paymentBreakdown.principal + $scope.paymentBreakdown.interest + $scope.paymentBreakdown.fees + $scope.paymentBreakdown.cpp;
  });

  $scope.$watch('selector.additionalAmount', function(newVal) {
    var subtotal = $scope.paymentBreakdown.principal + $scope.paymentBreakdown.fees + $scope.paymentBreakdown.interest + $scope.paymentBreakdown.cpp;

    if(newVal && newVal > 0) {
      $scope.total = subtotal + parseFloat(newVal);
    } else {
      $scope.total = subtotal;
    }
  });

  $scope.close = function() {
    dialog.close();
  };

  $scope.confirm = function() {
    $scope.validity = angular.copy($scope.paymentOptionsForm);

    if(!$scope.paymentOptionsForm.$valid) {
      // form is invalid, don't submit
      return;
    }

    cartItem.isPayoff = $scope.selector.paymentOption === 'payoff' ? true : false;

    if(!cartItem.isPayoff) {
      cartItem.payment.additionalPrincipal = parseFloat($scope.selector.additionalAmount);
    }

    dialog.close();
  };

});
