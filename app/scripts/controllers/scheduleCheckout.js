'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduleCheckoutCtrl', function ($scope, dialog, api, moment, payment, fee, possibleDates, Payments, PaymentOptions) {

    // default to the next available date
    var orderedDates = _.keys(possibleDates).sort();
    var item = payment ? payment : fee;
    $scope.updateInProgress = false;

    $scope.type = payment ? 'payment' : 'fee';
    $scope.isPayment = !!payment;

    $scope.model = {
      // we use a copy of the original payment/breakdown, so that if we change
      // the date and then cancel, our original payment object won't
      // retain those changes.
      payment: angular.copy(payment),
      fee: fee,
      selectedDate: item.scheduleDate || moment(orderedDates[0]).toDate(), // next available date
      possibleDates: possibleDates,
      canPayNow: false,
      breakdown: fee ? null : angular.copy(payment.getBreakdown())
    };

    Payments.canPayNow().then(function (result) {
      $scope.model.canPayNow = result;
    });

    // update breakdown based on date.
    $scope.$watch('model.selectedDate', function(newVal, oldVal) {
      if (!$scope.isPayment) { // it's a fee and won't have a breakdown; nothing to update
        return;
      }

      if (newVal === oldVal || !$scope.checkDate(newVal)) {
        return; // our value is old or invalid; don't update breakdown
      } else {
        var isPayoff = item.isPayoff();
        $scope.updateInProgress = true;

        Payments.updatePaymentAmountOnDate($scope.model.payment, newVal, isPayoff).then(function(result) {
          $scope.updateInProgress = false;
          $scope.model.breakdown.amount = result.PaymentAmount;
          $scope.model.breakdown.principal = result.PrincipalAmount;
          $scope.model.breakdown.fees = result.FeeAmount;
          $scope.model.breakdown.interest = result.InterestAmount;
          $scope.model.breakdown.cpp = result.CollateralProtectionAmount;

          if($scope.model.payment.paymentOption === PaymentOptions.TYPE_INTEREST) {
            $scope.model.breakdown.principal = 0;
            $scope.model.breakdown.fees = 0;
            $scope.model.breakdown.cpp = 0;
            $scope.model.breakdown.amount = $scope.model.breakdown.interest;
          }
        }, function(/*error*/) {
          $scope.updateInProgress = false;
        });
      }
    });

    $scope.checkDate = function (date) {
      // this can be called by the nxg-requires validator with no date - in this case,
      // just return true; the error will be handled upstream by the required validator
      if (!date) { return true; }

      date = moment(date);

      // can't schedule any earlier than tomorrow or later than the payment due date
      var tomorrow = moment().add(1, 'day');
      if (date.isBefore(tomorrow, 'day') || date.isAfter(item.dueDate, 'day')) {
        return false;
      }

      // check if the date is a possible payment date per data
      var key = api.toShortISODate(date.toDate());
      return !!$scope.model.possibleDates[key];
    };

    $scope.commit = function () {
      $scope.validity = angular.copy($scope.dateForm);
      if (!$scope.dateForm.$valid) {
        return;
      }

      $scope.finalize($scope.model.selectedDate);
    };

    $scope.finalize = function (scheduleDate) {
      if (item.isFee){
        item.scheduleDate = scheduleDate;
        dialog.close();
      } else {
        $scope.submitInProgress = true;
        // based on the scheduled date, or lack thereof, the payment amount may change due to interest accrual etc.
        Payments.updatePaymentAmountOnDate(item, scheduleDate || new Date(), item.isPayoff()).then(
          function () {
            $scope.submitInProgress = false;
            item.scheduleDate = scheduleDate;
            dialog.close();
          }, function (/*error*/) {
            $scope.submitInProgress = false;
          }
        );
      }
    };

    $scope.close = function() {
      dialog.close();
    };
  });
