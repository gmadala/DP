'use strict';

/*
 * This controller expects an object with payment information (either a
 * cartItem object or a payment object from vehicle details) and an isOnQueue
 * flag to determine which function the paymentOptionsHelper service should use.
 * PaymentOptionsHelper then builds a new object in a format the controller can
 * properly consume.
 *
 * Upon submission, if we started with a cartItem, we just update that existing
 * object. If we started with a vehicle details payment object, we add it to the
 * queue first, and then edit its properties according to the form inputs.
 *
*/
angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, paymentOptionsHelper, Payments, object, isOnQueue) {

    $scope.paymentObject = isOnQueue ? paymentOptionsHelper.fromCartItem(object) : paymentOptionsHelper.fromVehicleDetails(object);

    $scope.maxAdditional = $scope.paymentObject.payoff.amount - $scope.paymentObject.payment.amount;
    $scope.paymentBreakdown = {};
    $scope.total = 0;

    $scope.selector = {
      paymentOption: $scope.paymentObject.paymentOption,
      additionalAmount: $scope.paymentObject.payment.additionalPrincipal || null
    };

    $scope.$watch('selector.paymentOption', function(newVal) {
      if(newVal === 'payoff') {
        $scope.paymentBreakdown = $scope.paymentObject.payoff;
      } else if (newVal === 'payment') {
        $scope.paymentBreakdown = $scope.paymentObject.payment;
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

      if(!Payments.isPaymentOnQueue($scope.paymentObject.id)) {
        // If it's not on the queue yet, add it. Then set our local paymentObject on the
        // scope to the newly created cart item, so we can access the items we need to update.
        Payments.addPaymentToQueue($scope.paymentObject.originalObject, $scope.selector.paymentOption === 'payoff');
        $scope.paymentObject = Payments.getPaymentFromQueue($scope.paymentObject.id);
      }

      $scope.paymentObject.isPayoff = $scope.selector.paymentOption === 'payoff' ? true : false;

      if(!$scope.paymentObject.isPayoff) {
        $scope.paymentObject.payment.additionalPrincipal = parseFloat($scope.selector.additionalAmount);
      }

      dialog.close();
    };

  })
  .service('paymentOptionsHelper', function() {
    var paymentOptionsHelper = {
      fromCartItem: function(cartItem) {
        var ret = {
            id: cartItem.id,
            description: cartItem.description,
            isOnQueue: true,
            paymentOption: cartItem.isPayoff ? 'payoff' : 'payment',
            payoff: cartItem.payoff,
            payment: cartItem.payment
          };

        return ret;
      },
      fromVehicleDetails: function(object) {
        var ret = {
          id: object.FloorplanId,
          description: object.UnitDescription,
          isOnQueue: false,
          paymentOption: null,
          payoff: {
            amount: object.CurrentPayoff,
            principal: object.PrincipalPayoff,
            fees: object.FeesPayoffTotal,
            interest: object.InterestPayoffTotal,
            cpp: object.CollateralProtectionPayoffTotal
          },
          payment: {
            amount: object.AmountDue,
            principal: object.PrincipalDue,
            fees: object.FeesPaymentTotal,
            interest: object.InterestPaymentTotal,
            cpp: object.CollateralProtectionPaymentTotal,
            additionalPrincipal:0
          },
          originalObject: object // to store the original payment object that we'll need in order to add it to the queue properly.
        };
        return ret;
      }
    };

    return paymentOptionsHelper;
  });
