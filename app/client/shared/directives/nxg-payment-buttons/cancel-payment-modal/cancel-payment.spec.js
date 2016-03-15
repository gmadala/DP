'use strict';

describe('Controller: CancelPaymentCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var CancelPaymentCtrl,
    scope,
    optionsMock,
    dialogMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    optionsMock = {
      payment: {
        webScheduledPaymentId: 'schedId',
        vin: 'somevin',
        description: 'some description',
        stockNumber: 'stockNumber',
        scheduledDate: '2010-10-10',
        isPayOff: false,
        currentPayOff: 5000,
        amountDue: 1000
      },
      title: 'some title',
      onCancel: angular.noop
    };
    dialogMock = {
      close: angular.noop
    };

    CancelPaymentCtrl = $controller('CancelPaymentCtrl', {
      $scope: scope,
      $uibModalInstance: dialogMock,
      options: optionsMock
    });
  }));

  it('should attach the provided payment object to the scope', function () {
    expect(scope.payment).toBe(optionsMock.payment);
  });

  it('should attach the provided title to the scope', function () {
    expect(scope.title).toBe(optionsMock.title);
  });

  it('should use a default title if none is provided', inject(function($controller) {
    optionsMock.title = '';
    CancelPaymentCtrl = $controller('CancelPaymentCtrl', {
      $scope: scope,
      $uibModalInstance: dialogMock,
      options: optionsMock
    });
    expect(scope.title).toBe('Cancel Payment');
  }));

  describe('handleNo function', function () {

    it('should close the dialog with false', function () {
      spyOn(dialogMock, 'close');
      scope.handleNo();
      expect(dialogMock.close).toHaveBeenCalledWith(false);
    });

  });

  describe('handleYes function', function () {

    var q, Payments;

    beforeEach(inject(function ($q, _Payments_) {
      q = $q;
      Payments = _Payments_;
    }));

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.when(true));
      scope.handleYes();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should call cancelScheduled in payments model with web scheduled payment id of provided payment', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.when(true));
      scope.handleYes();
      expect(Payments.cancelScheduled).toHaveBeenCalledWith('schedId');
    });

    it('should set submitInProgress to false and close the dialog with true on success', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.when(true));
      spyOn(dialogMock, 'close');
      scope.handleYes();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialogMock.close).toHaveBeenCalledWith(true);
    });

    it('should call the onCancel function, if defined, on success', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.when(true));
      spyOn(optionsMock, 'onCancel');

      scope.handleYes();
      scope.$apply();
      expect(optionsMock.onCancel).toHaveBeenCalled();
    });

    it('should not blow up on success if onCancel is not defined in the options', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.when(true));
      optionsMock.onCancel = undefined;

      scope.handleYes();
      expect(function () {
        scope.$apply();
      }).not.toThrow();
    });

    it('should set submitInProgress to false on error and remain open', function () {
      spyOn(Payments, 'cancelScheduled').and.returnValue(q.reject('fail'));
      spyOn(dialogMock, 'close');
      spyOn(optionsMock, 'onCancel');
      scope.handleYes();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialogMock.close).not.toHaveBeenCalled();
      expect(optionsMock.onCancel).not.toHaveBeenCalled();
    });

  });

});
