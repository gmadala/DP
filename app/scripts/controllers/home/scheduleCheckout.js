'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduleCheckoutCtrl', function ($scope, dialog, api, moment, payment, possibleDates, Payments) {

    console.log(possibleDates);

    $scope.model = {
      payment: payment,
      selectedDate: null,
      possibleDates: possibleDates,
      canPayNow: false
    };

    $scope.checkDate = function (date) {
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

    Payments.canPayNow().then(function (result) {
      $scope.model.canPayNow = result;
    });

    $scope.removeSchedule = function () {
      payment.scheduleDate = null;
      dialog.close();
    };

    $scope.commit = function () {
      // TODO: validate that a date was entered
      payment.scheduleDate = $scope.model.selectedDate;
      dialog.close();
    };

    $scope.close = function() {
      dialog.close();
    };

  });
