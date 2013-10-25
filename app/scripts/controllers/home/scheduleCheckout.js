'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduleCheckoutCtrl', function ($scope, dialog, api, moment, payment, possibleDates, Payments) {

    // default to the next available date
    var orderedDates = _.keys(possibleDates).sort();

    $scope.model = {
      payment: payment,
      selectedDate: payment.scheduleDate || moment(orderedDates[0]).toDate(), // next available date
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
      if (date.isBefore(tomorrow, 'day') || date.isAfter(payment.dueDate, 'day')) {
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
      $scope.submitInProgress = true;
      // based on the scheduled date, or lack thereof, the payment amount may change due to interest accrual etc.
      Payments.fetchPaymentAmountOnDate(payment.floorplanId, scheduleDate || new Date(), payment.isPayoff).then(
        function (newAmount) {
          $scope.submitInProgress = false;
          payment.scheduleDate = scheduleDate;
          payment.amount = newAmount;
          dialog.close();
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.close = function() {
      dialog.close();
    };

  });
