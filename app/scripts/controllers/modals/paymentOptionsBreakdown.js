'use strict';

/*
 * This controller expects an object with payment information
 * (either a cartItem object or a payment object from vehicle
 * details) and an isOnQueue flag to determine which function the
 * paymentOptionsHelper service should use.
 *
 * Upon submission, if we started with a cartItem from the queue, we just
 * update that existing object. If we started with a cartItem created
 * from vehicle details, we add it to the queue first, and then edit its
 * properties according to the form inputs.
 *
*/
angular.module('nextgearWebApp')
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, paymentOptionsHelper, Payments, PaymentOptions, object, isOnQueue) {
    $scope.PaymentOptions = PaymentOptions;

    $scope.paymentObject = isOnQueue ? paymentOptionsHelper.fromCartItem(object) : paymentOptionsHelper.fromVehicleDetails(object);

    $scope.curtailmentObject = $scope.paymentObject.getBreakdown(PaymentOptions.TYPE_PAYMENT);

    $scope.maxAdditional = $scope.paymentObject.payoff.amount - $scope.paymentObject.payment.amount;
    $scope.paymentBreakdown = {};
    $scope.total = 0;

    $scope.selector = {
      paymentOption: $scope.paymentObject.paymentOption
    };

    $scope.$watch('selector.paymentOption', function(newVal) {
      $scope.paymentBreakdown = $scope.paymentObject.getBreakdown(newVal);
    });

    $scope.close = function() {
      dialog.close(false);
    };

    $scope.confirm = function() {
      $scope.validity = angular.copy($scope.paymentOptionsForm);

      if(!$scope.paymentOptionsForm.$valid) {
        // form is invalid, don't submit
        return;
      }

      if(!Payments.isPaymentOnQueue($scope.paymentObject.id)) {
        Payments.addPaymentTypeToQueue($scope.paymentObject, $scope.selector.paymentOption);
      }

      // grab the original cartItem object, so that our changes are saved.
      $scope.paymentObject = Payments.getPaymentFromQueue($scope.paymentObject.id);

      // update the payment option
      $scope.paymentObject.paymentOption = $scope.selector.paymentOption;

      // update additional amount if this is a curtailment payment
      if($scope.paymentObject.paymentOption === PaymentOptions.TYPE_PAYMENT) {
        $scope.paymentObject.setExtraPrincipal($scope.curtailmentObject.additionalPrincipal);
      }

      dialog.close(true);
    };

  })
  .service('paymentOptionsHelper', function(CartItem) {
    var paymentOptionsHelper = {
      fromCartItem: function(cartItem) {
        return angular.copy(cartItem);
      },
      fromVehicleDetails: function(object) {
        return CartItem.fromPayment(object, null);
      }
    };

    return paymentOptionsHelper;
  });
