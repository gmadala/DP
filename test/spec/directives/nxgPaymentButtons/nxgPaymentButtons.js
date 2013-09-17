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
        'item="myFee" queue-status="inQueue" can-pay-now="isOpen"></div>');
      scope = $rootScope.$new();
      scope.myFee = {};
      scope.inQueue = false;
      scope.isOpen = true;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles fee presence in the payment queue', function() {
      spyOn(Payments, 'addToPaymentQueue');
      spyOn(Payments, 'removeFromPaymentQueue');

      element.find('#toggleFee').click();

      scope.$apply(function () {
        scope.inQueue = true;
      });

      element.find('#toggleFee').click();

      expect(Payments.addToPaymentQueue).toHaveBeenCalledWith(scope.myFee, undefined);
      expect(Payments.removeFromPaymentQueue).toHaveBeenCalledWith(scope.myFee);
    });

    it('button should be disabled if we are outside business hours', function() {
      spyOn(Payments, 'addToPaymentQueue');

      scope.$apply(function () {
        scope.isOpen = false;
      });

      expect(element.find('#toggleFee').attr('disabled')).toBeDefined();
    });

  });

  describe('payment mode', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: false,
        PayPayoffAmount: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles payment presence in the payment queue', function() {
      spyOn(Payments, 'addToPaymentQueue');
      spyOn(Payments, 'removeFromPaymentQueue');

      element.find('#togglePayment').click();

      scope.$apply(function () {
        scope.inQueue = 'payment';
      });

      element.find('#togglePayment').click();

      expect(Payments.addToPaymentQueue).toHaveBeenCalledWith(scope.myPayment, undefined);
      expect(Payments.removeFromPaymentQueue).toHaveBeenCalledWith(scope.myPayment);
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
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        PayPayoffAmount: false
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
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(scope.myPayment);
    });

  });

  describe('payment mode (payoff previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payment" ' +
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        PayPayoffAmount: true
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
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: false,
        PayPayoffAmount: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have a button that toggles payoff presence in the payment queue', function() {
      spyOn(Payments, 'addToPaymentQueue');
      spyOn(Payments, 'removeFromPaymentQueue');

      element.find('#togglePayoff').click();

      scope.$apply(function () {
        scope.inQueue = 'payoff';
      });

      element.find('#togglePayoff').click();

      expect(Payments.addToPaymentQueue).toHaveBeenCalledWith(scope.myPayment, true);
      expect(Payments.removeFromPaymentQueue).toHaveBeenCalledWith(scope.myPayment);
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
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        PayPayoffAmount: true
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
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(scope.myPayment);
    });

  });

  describe('payoff mode (payment previously scheduled)', function () {

    var dialog;

    beforeEach(inject(function ($rootScope, $compile, $dialog) {
      dialog = $dialog;
      element = angular.element('<div nxg-payment-buttons="payoff" ' +
        'item="myPayment" queue-status="inQueue"></div>');
      scope = $rootScope.$new();
      scope.myPayment = {
        Scheduled: true,
        PayPayoffAmount: false
      };
      scope.inQueue = false;
      $compile(element)(scope);
      $rootScope.$digest();
    }));

    it('should have an inert add payoff button', function() {
      expect(element.find('#fakeTogglePayoff').attr('disabled')).toBeDefined();
    });

  });

});
