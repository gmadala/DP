(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ScheduleCheckoutCtrl', ScheduleCheckoutCtrl);

  ScheduleCheckoutCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    'api',
    'moment',
    'payment',
    'fee',
    'possibleDates',
    'Payments',
    'PaymentOptions'
  ];

  function ScheduleCheckoutCtrl(
    $scope,
    $uibModalInstance,
    api,
    moment,
    payment,
    fee,
    possibleDates,
    Payments,
    PaymentOptions) {

    // default to the next available date
    var orderedDates = _.keys(possibleDates).sort();
    var item = payment ? payment : fee;
    var uibModalInstance = $uibModalInstance;

    $scope.updateInProgress = false;
    $scope.type = payment ? 'payment' : 'fee';
    $scope.isPayment = !!payment;
    $scope.dateFormat = 'MM/dd/yyyy';
    $scope.mindate= new Date();

    $scope.datePicker = {
      opened: false
    };
    $scope.openDatePicker = function() {
      $scope.datePicker.opened = true;
    };

    $scope.model = {
      // we use a copy of the original payment/breakdown, so that if we change
      // the date and then cancel, our original payment object won't
      // retain those changes.
      payment: angular.copy(payment),
      fee: fee,
      selectedDate: item.scheduleDate || moment(orderedDates[0]).toDate(), // next available date
      possibleDates: possibleDates,
      breakdown: fee ? null : angular.copy(payment.getBreakdown()),
      getPaymentTotal: function() {
        return fee ? fee.Balance : $scope.model.breakdown.principal + ($scope.model.breakdown.additionalPrincipal || 0)  +
        $scope.model.breakdown.interest + $scope.model.breakdown.fees + $scope.model.breakdown.cpp + $scope.model.breakdown.tpf;
      }
    };

    var prv = {
      handleNewDate: function(newVal) {
        if(!$scope.isPayment) {
          return;
        }

        var isPayoff = item.isPayoff();
        $scope.updateInProgress = true;

        Payments.updatePaymentAmountOnDate($scope.model.payment, newVal, isPayoff).then(function(result) {
          $scope.updateInProgress = false;
          $scope.model.breakdown.amount = result.PaymentAmount;
          $scope.model.breakdown.principal = result.PrincipalAmount;
          $scope.model.breakdown.fees = result.FeeAmount;
          $scope.model.breakdown.interest = result.InterestAmount;
          $scope.model.breakdown.cpp = result.CollateralProtectionAmount;
          $scope.model.breakdown.tpf = result.TransportationFee;

          if($scope.model.payment.paymentOption === PaymentOptions.TYPE_INTEREST) {
            $scope.model.breakdown.principal = 0;
            $scope.model.breakdown.fees = 0;
            $scope.model.breakdown.cpp = 0;
            $scope.model.breakdown.tpf = 0;
            $scope.model.breakdown.amount = $scope.model.breakdown.interest;
          }
        }, function(/*error*/) {
          $scope.updateInProgress = false;
        });
      }
    };

    // initial amounts
    // prv.handleNewDate($scope.model.selectedDate);

    // update breakdown based on date.
    $scope.$watch('model.selectedDate', function(newVal, oldVal) {
      if (!$scope.isPayment) { // it's a fee and won't have a breakdown; nothing to update
        return;
      }

      if (newVal === oldVal || !$scope.disabled(newVal)) {
        return; // our value is old or invalid; don't update breakdown
      } else {
        prv.handleNewDate(newVal);
      }
    });

    $scope.disabled = function (date, mode) {
      // this can be called by the nxg-requires validator with no date - in this case,
      // just return true; the error will be handled upstream by the required validator
      if (!date) { return 0; }

      date = moment(date);

      // check if the date is a possible payment date per data
      var key = api.toShortISODate(date.toDate());
      mode = ($scope.model.possibleDates[key] === true ? 0 : 1);
      return mode;
    };

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
        uibModalInstance.close();
      } else {
        $scope.submitInProgress = true;
        // based on the scheduled date, or lack thereof, the payment amount may change due to interest accrual etc.
        Payments.updatePaymentAmountOnDate(item, scheduleDate || new Date(), item.isPayoff()).then(
          function () {
            $scope.submitInProgress = false;
            item.scheduleDate = scheduleDate;
            uibModalInstance.close();
          }, function (/*error*/) {
            $scope.submitInProgress = false;
          }
        );
      }
    };

    $scope.close = function() {
      uibModalInstance.close();
    };

  }
})();
