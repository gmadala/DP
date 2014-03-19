'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduleCheckoutCtrl', function ($scope, dialog, api, moment, payment, fee, possibleDates, Payments) {

    // default to the next available date
    var orderedDates = _.keys(possibleDates).sort();
    var item = payment ? payment : fee;

    $scope.type = payment ? 'payment' : 'fee';

    $scope.model = {
      payment: payment,
      fee: fee,
      selectedDate: item.scheduleDate || moment(orderedDates[0]).toDate(), // next available date
      possibleDates: possibleDates,
      canPayNow: false
    };

    Payments.canPayNow().then(function (result) {
      $scope.model.canPayNow = result;
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

    $scope.removeSchedule = function () {
      $scope.finalize(null);
    };

    $scope.commit = function () {
      $scope.validity = angular.copy($scope.dateForm);
      if (!$scope.dateForm.$valid) {
        return;
      }

      $scope.finalize($scope.model.selectedDate);
    };

    $scope.finalize = function (scheduleDate) {
      if(item.isPayment) {
        $scope.submitInProgress = true;
        // based on the scheduled date, or lack thereof, the payment amount may change due to interest accrual etc.
        Payments.fetchPaymentAmountOnDate(item.floorplanId, scheduleDate || new Date(), item.isPayoff).then(
          function (newAmounts) {
            $scope.submitInProgress = false;
            item.scheduleDate = scheduleDate;
            item.amount = newAmounts.PaymentAmount;
            item.feesTotal = newAmounts.FeeAmount;
            item.interestTotal = newAmounts.InterestAmount;
            item.principal = newAmounts.PrincipalAmount;
            item.collateralTotal = newAmounts.CollateralProtectionAmount;
            dialog.close();
          }, function (/*error*/) {
            $scope.submitInProgress = false;
          }
        );
      } else {
        item.scheduleDate = scheduleDate;
        dialog.close();
      }
    };

    $scope.close = function() {
      dialog.close();
    };

  });
