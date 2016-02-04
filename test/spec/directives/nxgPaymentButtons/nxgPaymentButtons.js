'use strict';

describe('Directive: nxgPaymentButtons', function () {

  var element,
    scope,
    Payments,
    PaymentOptions,
    httpBackend;

  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html'));

  beforeEach(inject(function (_Payments_, _PaymentOptions_, $httpBackend) {
    httpBackend = $httpBackend;
    httpBackend.expectGET('scripts/directives/nxgIcon/nxgIcon.html').respond('<div></div>');
    httpBackend.expectGET('views/modals/cancelPayment.html').respond('<div></div>');

    Payments = _Payments_;
    PaymentOptions = _PaymentOptions_;
  }));

  describe('fee mode', function () {
    var iScope;

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

      iScope = element.isolateScope();
    }));

    it('should have a button that toggles fee presence in the payment queue', function() {
      spyOn(Payments, 'addFeeToQueue');
      spyOn(Payments, 'removeFeeFromQueue');

      iScope.toggleFeeInQueue();
      scope.$apply(function () {
        scope.inQueue = true;
      });

      iScope.toggleFeeInQueue();

      expect(Payments.addFeeToQueue).toHaveBeenCalledWith(
        scope.myFee,
        true /* isFee */
      );
      expect(Payments.removeFeeFromQueue).toHaveBeenCalledWith(scope.myFee.FinancialRecordId);
    });

    describe('fee mode (fee previously scheduled)', function() {
      var dialog,
          iScope;

      beforeEach(inject(function ($rootScope, $compile, $uibModal) {
        dialog = $uibModal;
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

        iScope = element.isolateScope();
      }));

      it('should have a cancel scheduled fee button that invokes the cancel scheduled fee modal', function() {
        spyOn(dialog, 'open').and.returnValue({
          open: angular.noop
        });

        iScope.cancelScheduledFee();

        expect(dialog.open).toHaveBeenCalled();
        expect(dialog.open.calls.mostRecent().args[0].templateUrl).toBe('views/modals/cancelFee.html');
        expect(dialog.open.calls.mostRecent().args[0].controller).toBe('CancelFeeCtrl');
        expect(dialog.open.calls.mostRecent().args[0].resolve.options().fee.webScheduledAccountFeeId).toBe('webFee1');
        expect(dialog.open.calls.mostRecent().args[0].resolve.options().fee.feeType).toBe('FeeType');
        expect(dialog.open.calls.mostRecent().args[0].resolve.options().fee.description).toBe('FeeDescription');
        expect(dialog.open.calls.mostRecent().args[0].resolve.options().fee.scheduledDate).toBe('2013-01-01');
        expect(dialog.open.calls.mostRecent().args[0].resolve.options().fee.balance).toBe(1500);

        dialog.dialog.calls.mostRecent().args[0].resolve.options().onCancel();
        expect(scope.myFee.Scheduled).toBe(false);
        expect(scope.myFee.ScheduledDate).toBe(null);
      });
    });
  });

  describe('cancel scheduled payment', function() {
    var myPayment,
        dialog,
        shouldBeCancelled;

    beforeEach(inject(function ($uibModal) {
      dialog = $uibModal;
      myPayment = {
        FloorplanId: 'floorplanId',
        Vin: 'vin',
        UnitDescription: 'some description',
        StockNumber: 'stockNum',
        CurrentPayoff: 20000,
        PrincipalPayoff: 18000,
        AmountDue: 1000,
        PrincipalDue: 800,
        Scheduled: true,
        ScheduledPaymentDate: '2013-10-10',
        CurtailmentPaymentScheduled: true,
        PayPayoffAmount: false,
        DueDate: '2013-01-01',
        FeesPaymentTotal: 20,
        FeesPayoffTotal: 25,
        InterestPaymentTotal: 40,
        InterestPayoffTotal: 45,
        CollateralProtectionPayoffTotal: 85,
        CollateralProtectionPaymentTotal: 90
      };

      shouldBeCancelled = true;

      spyOn(dialog, 'open').and.callFake(function() {
        return {
          open: function() {
            return {
              then: function() {
                return shouldBeCancelled;
              }
            };
          }
        };
      });
    }));

    it('should use an onCancel function if one is provided', inject(function($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" on-queue="inQueue" ng-click="togglePaymentInQueue(false)" on-cancel-scheduled-payment="myFunc()"></div>');
      scope = $rootScope.$new();

      scope.myPayment = myPayment;
      scope.myFunc = function() {
        return 'foo';
      };
      spyOn(scope, 'myFunc').and.callThrough();
      scope.inQueue = false;

      $compile(element)(scope);
      $rootScope.$digest();
      var iScope = element.isolateScope();

      iScope.cancelScheduledPayment();

      expect(dialog.open).toHaveBeenCalled();
      dialog.open.calls.mostRecent().args[0].resolve.options().onCancel();
      expect(scope.myFunc).toHaveBeenCalled();
    }));

    it('should run properly without an onCancel function', inject(function($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" on-queue="inQueue" ng-click="togglePaymentInQueue(false)"></div>');
      scope = $rootScope.$new();

      scope.myPayment = myPayment;
      scope.inQueue = false;

      $compile(element)(scope);
      $rootScope.$digest();
      var iScope = element.isolateScope();

      iScope.cancelScheduledPayment();
      expect(iScope.onCancelScheduledPayment).toBe(null);

      expect(dialog.open).toHaveBeenCalled();
    }));
  });

  describe('payment mode', function () {
    var iScope;

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

      iScope = element.isolateScope();
    }));

    it('should have a button that toggles payment presence in the payment queue', function() {
      expect(Payments.isPaymentOnQueue(scope.myPayment.FloorplanId)).toBeFalsy();
      iScope.togglePaymentInQueue(false);
      expect(Payments.isPaymentOnQueue(scope.myPayment.FloorplanId)).toEqual(PaymentOptions.TYPE_PAYMENT);
    });

    it('should auto-remove a vehicle payoff from the queue if adding a curtailment payment for that vehicle instead', function() {
      spyOn(Payments, 'addPaymentToQueue');
      spyOn(Payments, 'removePaymentFromQueue');

      scope.$apply(function() {
        scope.inQueue = 'payoff';
      });

      iScope.togglePaymentInQueue(false);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
      expect(Payments.addPaymentToQueue).toHaveBeenCalledWith(scope.myPayment, false);
    });
  });

  describe('payment mode (payment previously scheduled)', function () {
    var dialog,
    iScope;

    beforeEach(inject(function ($rootScope, $compile, $uibModal) {
      dialog = $uibModal;
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
        ScheduledPaymentAmount: 1400,
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

      iScope = element.isolateScope();
    }));

    it('should have a cancel scheduled payment button that invokes the cancel scheduled payment modal', function() {
      spyOn(dialog, 'open').and.returnValue({
        open: angular.noop
      });

      iScope.cancelScheduledPayment();
      expect(dialog.open).toHaveBeenCalled();
      expect(dialog.open.calls.mostRecent().args[0].templateUrl).toBe('views/modals/cancelPayment.html');
      expect(dialog.open.calls.mostRecent().args[0].controller).toBe('CancelPaymentCtrl');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.webScheduledPaymentId).toBe('webPay1');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.vin).toBe('vin');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.description).toBe('some description');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.stockNumber).toBe('stocknumber');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.scheduledDate).toBe('2013-10-10');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.isPayOff).toBe(false);
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.currentPayOff).toBe(5000);
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.amountDue).toBe(1400);
    });

  });

  describe('payment mode (payoff previously scheduled)', function () {
    var dialog,
    iScope;

    beforeEach(inject(function ($rootScope, $compile, $uibModal) {
      dialog = $uibModal;
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

      iScope = element.isolateScope();

    }));

    it('should auto-cancel the previously scheduled payoff when a payment is added', function() {
      spyOn(dialog, 'open').and.returnValue({
         open: function() {
          return {
            then: function(wasCancelled) {
              return true;
            }
          };
        }
      });

      iScope.togglePaymentInQueue(false);
      expect(dialog.open).toHaveBeenCalled();
      expect(dialog.open.calls.mostRecent().args[0].controller).toBe('CancelPaymentCtrl');
    });

    it('should add the payment if the user ends up cancelling the scheduled payment', inject(function($q, $rootScope) {
      spyOn(iScope, 'cancelScheduledPayment').and.returnValue($q.when(true));

      spyOn(Payments, 'addPaymentTypeToQueue').and.callThrough();
      iScope.togglePaymentInQueue(false);
      $rootScope.$digest();

      expect(iScope.cancelScheduledPayment).toHaveBeenCalled();
      expect(Payments.addPaymentTypeToQueue).toHaveBeenCalled();
    }));

    it('should not add the payment if the user does not cancel the previously scheduled payment (ie. clicks No)', inject(function($q, $rootScope) {
      spyOn(iScope, 'cancelScheduledPayment').and.returnValue($q.when(false));

      spyOn(Payments, 'addPaymentToQueue').and.callThrough();
      iScope.togglePaymentInQueue(false);
      $rootScope.$digest();

      expect(Payments.addPaymentToQueue).not.toHaveBeenCalled();
    }));
  });

  describe('payoff mode', function () {
    var iScope;

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

      iScope = element.isolateScope();
    }));

    it('should have a button that toggles payoff presence in the payment queue', function() {
      spyOn(Payments, 'removePaymentFromQueue');

      iScope.togglePaymentInQueue(true);
      scope.$apply(function () {
        scope.inQueue = 'payoff';
      });

      iScope.togglePaymentInQueue(true);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
    });

    it('should auto-remove a vehicle curtailment payment from the queue if adding a payoff for that vehicle instead', function() {
      spyOn(Payments, 'addPayoffToQueue');
      spyOn(Payments, 'removePaymentFromQueue');

      scope.$apply(function() {
        scope.inQueue = 'payment';
      });

      iScope.togglePaymentInQueue(true);
      expect(Payments.removePaymentFromQueue).toHaveBeenCalledWith(scope.myPayment.FloorplanId);
      expect(Payments.addPayoffToQueue).toHaveBeenCalledWith(scope.myPayment, false);
    });
  });

  describe('payoff mode (payoff previously scheduled)', function () {
    var dialog,
        iScope;

    beforeEach(inject(function ($rootScope, $compile, $uibModal) {
      dialog = $uibModal;
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
        ScheduledPaymentAmount: 1600,
        WebScheduledPaymentId: 'webPay2',
        CurtailmentPaymentScheduled: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();

      iScope = element.isolateScope();
    }));

    it('should have a cancel scheduled payoff button that invokes the cancel scheduled payment modal', function() {
      spyOn(dialog, 'open').and.returnValue({
        open: angular.noop
      });

      iScope.cancelScheduledPayment();
      expect(dialog.open).toHaveBeenCalled();
      expect(dialog.open.calls.mostRecent().args[0].templateUrl).toBe('views/modals/cancelPayment.html');
      expect(dialog.open.calls.mostRecent().args[0].controller).toBe('CancelPaymentCtrl');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.webScheduledPaymentId).toBe('webPay2');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.vin).toBe('vin');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.description).toBe('some description');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.stockNumber).toBe('stocknum');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.scheduledDate).toBe('2013-10-10');
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.isPayOff).toBe(true);
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.currentPayOff).toBe(20000);
      expect(dialog.open.calls.mostRecent().args[0].resolve.options().payment.amountDue).toBe(1600);
    });

  });

  describe('payoff mode (payment previously scheduled)', function () {
    var dialog,
        iScope;

    beforeEach(inject(function ($rootScope, $compile, $uibModal) {
      dialog = $uibModal;
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
      iScope = element.isolateScope();
    }));

    it('should auto-cancel the previously scheduled payment when a payoff is added', function() {
      spyOn(dialog, 'open').and.returnValue({
         open: function() {
          return {
            then: function(wasCancelled) {
              return true;
            }
          };
        }
      });

      iScope.togglePaymentInQueue(true);
      expect(dialog.open).toHaveBeenCalled();
    });
  });
});
