'use strict';

/*
 * This controller expects an object with payment information
 * (either a cartItem object or a payment object from vehicle
 * details) and an isOnQueue flag to determine which function the
 * paymentOptionsHelper service should use. PaymentOptionsHelper
 * then builds a new object in a format the controller can
 * properly consume.
 *
 * Upon submission, if we started with a cartItem, we just
 * update that existing object. If we started with a vehicle details
 * payment object, we add it to the queue first, and then edit its
 * properties according to the form inputs.
 *
*/
angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, paymentOptionsHelper, Payments, PaymentOptions, object, isOnQueue) {
    $scope.PaymentOptions = PaymentOptions;

    $scope.paymentObject = isOnQueue ? paymentOptionsHelper.fromCartItem(object) : paymentOptionsHelper.fromVehicleDetails(object);

    $scope.maxAdditional = $scope.paymentObject.payoff.amount - $scope.paymentObject.payment.amount;
    $scope.paymentBreakdown = {};
    $scope.total = 0;

    $scope.selector = {
      paymentOption: $scope.paymentObject.paymentOption,
      additionalAmount: $scope.paymentObject.payment.additionalPrincipal || 0
    };

    $scope.$watch('selector.paymentOption', function(newVal) {
      switch (newVal) {
      case PaymentOptions.TYPE_PAYOFF:
        $scope.paymentBreakdown = $scope.paymentObject.payoff;
        break;
      case PaymentOptions.TYPE_PAYMENT:
        $scope.paymentBreakdown = $scope.paymentObject.payment;
        break;
      case PaymentOptions.TYPE_INTEREST:
        $scope.paymentBreakdown = $scope.paymentObject.interest;
        break;
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
        // If it's not on the queue yet, add it. Then set
        // our local paymentObject on the scope to the newly
        // created cart item, so we can access the items
        // we need to update.

        if($scope.paymentObject.scheduled) {
          // auto-cancel previously scheduled payment; this mirrors
          // what happens if you add a payment via the normal payment
          // buttons when one was already scheduled.
          // since we include the original object when opening this
          // modal from vehicle details, we use that to get the
          // necessary WebScheduledPaymentId.
          Payments.cancelScheduled($scope.paymentObject.originalObject.WebScheduledPaymentId);
          // need to update local data for vehicle details page.
          $scope.paymentObject.originalObject.WebScheduledPaymentId = null;
          $scope.paymentObject.originalObject.Scheduled = false;
          $scope.paymentObject.originalObject.ScheduledPaymentDate = null;
        }
        Payments.addPaymentTypeToQueue($scope.paymentObject.originalObject, $scope.selector.paymentOption);
      }

      // grab the original cartItem object, so that our changes are saved.
      $scope.paymentObject = Payments.getPaymentFromQueue($scope.paymentObject.id);

      $scope.paymentObject.paymentOption = $scope.selector.paymentOption;

      if($scope.paymentObject.paymentOption === 'payment') {
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
            paymentOption: cartItem.paymentOption,
            payoff: cartItem.payoff,
            payment: cartItem.payment,
            interest: cartItem.interest
          };

        return ret;
      },
      fromVehicleDetails: function(object) {
        var ret = {
          id: object.FloorplanId,
          description: object.UnitDescription,
          isOnQueue: false,
          paymentOption: null,
          scheduled: object.Scheduled,

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
          interest: {
            amount: object.InterestPaymentTotal,
            principal: 0,
            fees: 0,
            interest: 0,
            cpp: 0
          },
          originalObject: object // to store the original payment object that we'll need in order to add it to the queue properly.
        };
        return ret;
      }
    };

    return paymentOptionsHelper;
  });
