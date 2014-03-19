'use strict';

describe('Directive: nxgPaymentButtons', function () {

  var element,
    scope,
    Payments;

  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html'));

  beforeEach(inject(function (_Payments_) {
    Payments = _Payments_;
  }));

  describe('fee mode', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="fee" ' +
        'item="myFee" on-queue="inQueue" can-pay-now="isOpen"></div>');
      scope = $rootScope.$new();
      scope.myFee = {
        FinancialRecordId: 'financialRecordId',
        Vin: 'FeeVin',
        FeeType: 'FeeType',
        Description: 'FeeDescription',
        Balance: 1500,
        EffectiveDate: '2013-01-01'
      };
      scope.inQueue = false;
      scope.isOpen = true;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles fee presence in the payment queue', function() {
      spyOn(Payments, 'addFeeToQueue');
      spyOn(Payments, 'removeFeeFromQueue');

      element.find('#toggleFee').click();

      scope.$apply(function () {
        scope.inQueue = true;
      });

      element.find('#toggleFee').click();

      expect(Payments.addFeeToQueue).toHaveBeenCalledWith(
        scope.myFee.FinancialRecordId,
        scope.myFee.Vin,
        scope.myFee.FeeType,
        scope.myFee.Description,
        scope.myFee.Balance,
        scope.myFee.EffectiveDate);
      expect(Payments.removeFeeFromQueue).toHaveBeenCalledWith(scope.myFee.FinancialRecordId);
    });

    describe('fee mode (fee previously scheduled)', function() {
      var dialog;

      beforeEach(inject(function ($rootScope, $compile, $dialog) {
        dialog = $dialog;
        element = angular.element('<div nxg-payment-buttons="fee" ' +
          'item="myFee" on-queue="inQueue"></div>');
        scope = $rootScope.$new();
        scope.myFee = {
          FeeType: 'FeeType',
          Description: 'FeeDescription',
          Balance: 1500,
          ScheduledDate: '2013-01-01',
          Scheduled: true,
          WebScheduledAccountFeeId: 'webFee1'
        };
        scope.inQueue = false;
        $compile(element)(scope);
        $rootScope.$digest();
      }));

      it('should have a cancel scheduled fee button that invokes the cancel scheduled fee modal', function() {
        spyOn(dialog, 'dialog').andReturn({
          open: angular.noop
        });

        element.find('#cancelScheduledFee').click();

        expect(dialog.dialog).toHaveBeenCalled();
        expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/cancelFee.html');
        expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('CancelFeeCtrl');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.webScheduledAccountFeeId).toBe('webFee1');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.feeType).toBe('FeeType');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.description).toBe('FeeDescription');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.scheduledDate).toBe('2013-01-01');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.balance).toBe(1500);
      });

    });
  });

  describe('payment mode', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" on-queue="inQueue" ng-click="togglePaymentInQueue(false)"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        FloorplanId: 'floorplanId',
        Vin: 'vin',
        UnitDescription: 'some description',
        StockNumber: 'stockNum',
        CurrentPayoff: 20000,
        PrincipalPayoff: 18000,
        AmountDue: 1000,
        PrincipalDue: 800,
        Scheduled: false,
        PayPayoffAmount: false,
        DueDate: '2013-01-01',
        FeesPaymentTotal: 20,
        FeesPayoffTotal: 25,
        InterestPaymentTotal: 40,
        InterestPayoffTotal: 45,
        CollateralProtectionPayoffTotal: 85,
        CollateralProtectionPaymentTotal: 90
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles payment presence in the payment queue', function() {
      spyOn(Payments, 'addPaymentToQueue');
      spyOn(Payments, 'removePaymentFromQueue');

      element.find('#togglePayment').click();

      scope.$apply(function () {
        scope.inQueue = 'payment';
      });

      element.find('#togglePayment').click();

      expect(Payments.addPaymentToQueue).toHaveBeenCalledWith(
        scope.myPayment.FloorplanId,
        scope.myPayment.Vin,
        scope.myPayment.StockNumber,
        scope.myPayment.UnitDescription,
        scope.myPayment.AmountDue,
        scope.myPayment.DueDate,
        false,
        scope.myPayment.PrincipalDue,
        40,
        20,
        90);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
    });

    it('payment toggle button should be disabled if payment is already in queue as payoff', function() {
      scope.$apply(function () {
        scope.inQueue = 'payoff';
      });

      expect(element.find('#togglePayment').attr('disabled')).toBeDefined();
    });

  });

  describe('payment mode (payment previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" on-queue="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Vin: 'vin',
        UnitDescription: 'some description',
        StockNumber: 'stocknumber',
        Scheduled: true,
        WebScheduledPaymentId: 'webPay1',
        ScheduledPaymentDate: '2013-10-10',
        CurtailmentPaymentScheduled: true,
        CurrentPayoff: 5000,
        AmountDue: 1000,
        FeesPaymentTotal: 20,
        FeesPayoffTotal: 25,
        InterestPaymentTotal: 40,
        InterestPayoffTotal: 45,
        CollateralProtectionPayoffTotal: 85,
        CollateralProtectionPaymentTotal: 90
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a cancel scheduled payment button that invokes the cancel scheduled payment modal', function() {
      spyOn(dialog, 'dialog').andReturn({
        open: angular.noop
      });

      element.find('#cancelScheduledPayment').click();

      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/cancelPayment.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('CancelPaymentCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.webScheduledPaymentId).toBe('webPay1');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.vin).toBe('vin');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.description).toBe('some description');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.stockNumber).toBe('stocknumber');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.scheduledDate).toBe('2013-10-10');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.isPayOff).toBe(false);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.currentPayOff).toBe(5000);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.amountDue).toBe(1000);
    });

  });

  describe('payment mode (payoff previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" on-queue="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        CurtailmentPaymentScheduled: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have an inert add payment button', function() {
      expect(element.find('#fakeTogglePayment').attr('disabled')).toBeDefined();
    });

  });

  describe('payoff mode', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="payoff" ' +
        'item="myPayment" on-queue="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        FloorplanId: 'floorplanId',
        Vin: 'vin',
        UnitDescription: 'some description',
        CurrentPayoff: 20000,
        PrincipalPayoff: 18000,
        AmountDue: 1000,
        PrincipalDue: 800,
        Scheduled: false,
        PayPayoffAmount: false,
        DueDate: '2013-02-03',
        StockNumber: '1234',
        FeesPaymentTotal: 20,
        FeesPayoffTotal: 25,
        InterestPaymentTotal: 40,
        InterestPayoffTotal: 45,
        CollateralProtectionPayoffTotal: 85,
        CollateralProtectionPaymentTotal: 90
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles payoff presence in the payment queue', function() {
      spyOn(Payments, 'addPaymentToQueue');
      spyOn(Payments, 'removePaymentFromQueue');

      element.find('#togglePayoff').click();

      scope.$apply(function () {
        scope.inQueue = 'payoff';
      });

      element.find('#togglePayoff').click();

      expect(Payments.addPaymentToQueue).toHaveBeenCalledWith(
        scope.myPayment.FloorplanId,
        scope.myPayment.Vin,
        scope.myPayment.StockNumber,
        scope.myPayment.UnitDescription,
        scope.myPayment.CurrentPayoff,
        scope.myPayment.DueDate,
        true,
        scope.myPayment.PrincipalPayoff,
        45,
        25,
        85);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
    });

    it('payoff toggle button should be disabled if payment is already in queue', function() {
      scope.$apply(function () {
        scope.inQueue = 'payment';
      });

      expect(element.find('#togglePayoff').attr('disabled')).toBeDefined();
    });

  });

  describe('payoff mode (payoff previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payoff" ' +
        'item="myPayment" on-queue="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        StockNumber: 'stocknum',
        Vin: 'vin',
        UnitDescription: 'some description',
        CurrentPayoff: 20000,
        AmountDue: 1000,
        Scheduled: true,
        ScheduledPaymentDate: '2013-10-10',
        WebScheduledPaymentId: 'webPay2',
        CurtailmentPaymentScheduled: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a cancel scheduled payoff button that invokes the cancel scheduled payment modal', function() {
      spyOn(dialog, 'dialog').andReturn({
        open: angular.noop
      });

      element.find('#cancelScheduledPayoff').click();

      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/cancelPayment.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('CancelPaymentCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.webScheduledPaymentId).toBe('webPay2');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.vin).toBe('vin');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.description).toBe('some description');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.stockNumber).toBe('stocknum');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.scheduledDate).toBe('2013-10-10');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.isPayOff).toBe(true);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.currentPayOff).toBe(20000);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.amountDue).toBe(1000);
    });

  });

  describe('payoff mode (payment previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payoff" ' +
        'item="myPayment" on-queue="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        CurtailmentPaymentScheduled: true,
        FloorplanId: 'floorplanId',
        Vin: 'vin',
        UnitDescription: 'some description',
        CurrentPayoff: 20000,
        PrincipalPayoff: 18000,
        AmountDue: 1000,
        PrincipalDue: 800,
        PayPayoffAmount: false,
        DueDate: '2013-02-03',
        StockNumber: '1234',
        FeesPaymentTotal: 20,
        FeesPayoffTotal: 25,
        InterestPaymentTotal: 40,
        InterestPayoffTotal: 45,
        CollateralProtectionPayoffTotal: 85,
        CollateralProtectionPaymentTotal: 90
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles payoff presence in the payment queue', function() {
      spyOn(Payments, 'addPaymentToQueue');
      spyOn(Payments, 'removePaymentFromQueue');

      element.find('#togglePayoff2').click();

      scope.$apply(function () {
        scope.inQueue = 'payoff';
      });

      element.find('#togglePayoff2').click();

      expect(Payments.addPaymentToQueue).toHaveBeenCalledWith(
        scope.myPayment.FloorplanId,
        scope.myPayment.Vin,
        scope.myPayment.StockNumber,
        scope.myPayment.UnitDescription,
        scope.myPayment.CurrentPayoff,
        scope.myPayment.DueDate,
        true,
        scope.myPayment.PrincipalPayoff,
        45,
        25,
        85);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
    });

    it('payoff toggle button should be disabled if payment is already in queue', function() {
      scope.$apply(function () {
        scope.inQueue = 'payment';
      });

      expect(element.find('#togglePayoff2').attr('disabled')).toBeDefined();
    });

  });

});
