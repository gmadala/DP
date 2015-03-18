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
  .controller('PaymentOptionsBreakdownCtrl', function ($scope, dialog, paymentOptionsHelper, Payments, PaymentOptions, object, isOnQueue, moment, BusinessHours) {
    $scope.PaymentOptions = PaymentOptions;

    $scope.paymentObject = isOnQueue ? paymentOptionsHelper.fromCartItem(object) : paymentOptionsHelper.fromVehicleDetails(object);
    $scope.curtailmentObject = $scope.paymentObject.getBreakdown(PaymentOptions.TYPE_PAYMENT);

    $scope.maxAdditional = $scope.paymentObject.payoff.amount - $scope.paymentObject.payment.amount;
    $scope.paymentBreakdown = {};
    $scope.total = 0;

    $scope.todayDate = moment().toDate();
    $scope.nextBusinessDay = null;
    var bizHours = function() {
      BusinessHours.insideBusinessHours().then(function(result) {
        $scope.canPayNow = result;

        if(!$scope.canPayNow) {
          BusinessHours.nextBusinessDay().then(function(nextBizDay) {
            $scope.nextBusinessDay = nextBizDay;
          });
        }

        $scope.canPayNowLoaded = true;
      }, function(error) {
        error.dismiss();
        $scope.canPayNow = false;
        $scope.canPayNowLoaded = false;
      });
    };

    // initial check
    bizHours();

    // when business hours change, update
    $scope.$on(BusinessHours.CHANGE_EVENT, function() {
      bizHours();
    });

    $scope.selector = {
      paymentOption: $scope.paymentObject.paymentOption
    };

    // assign the initial value of the optionInterestOnly field.
    $scope.optionInterestOnly = ($scope.selector.paymentOption === PaymentOptions.TYPE_INTEREST);

    $scope.$watch('selector.paymentOption', function(newVal) {
      $scope.paymentBreakdown = $scope.paymentObject.getBreakdown(newVal);
      // change the optionInterestOnly value as the watch update the value.
      $scope.optionInterestOnly = ($scope.selector.paymentOption === PaymentOptions.TYPE_INTEREST);
    });

    $scope.close = function() {
      dialog.close(false);
    };

    $scope.confirm = function() {
      $scope.validity = angular.copy($scope.paymentOptionsForm);

      // Other than Curtailment Payment is selected in the payment options then we are making checking any validation for the controls.
      if($scope.selector.paymentOption  !== PaymentOptions.TYPE_PAYMENT){
        $scope.paymentOptionsForm.$valid = true;
      }

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
