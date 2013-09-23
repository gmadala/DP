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
        vin: 'somevin',
        description: 'some description',
        stockNumber: 'stockNumber',
        scheduledDate: '2010-10-10',
        isPayOff: false,
        currentPayOff: 5000,
        amountDue: 1000
      },
      title: 'some title',
      onCancel: function() {}
    };
    dialogMock = {
      close: angular.noop
    };

    CancelPaymentCtrl = $controller('CancelPaymentCtrl', {
      $scope: scope,
      dialog: dialogMock,
      options: optionsMock
    });
  }));

  it('should attach the provided payment object to the scope', function () {
    expect(scope.payment).toBe(optionsMock.payment);
  });

  it('should attach the provided title to the scope', function () {
    expect(scope.title).toBe(optionsMock.title);
  });

  describe('handleNo function', function () {

    it('should close the dialog with false', function () {
      spyOn(dialogMock, 'close');
      scope.handleNo();
      expect(dialogMock.close).toHaveBeenCalledWith(false);
    });

  });

  describe('handleYes function', function () {

    var q, Payments

    beforeEach(inject(function ($q, _Payments_) {
      q = $q;
      Payments = _Payments_;
    }));

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.when(true));
      scope.handleYes();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should call cancelScheduled in payments model with provided payment', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.when(true));
      scope.handleYes();
      expect(Payments.cancelScheduled).toHaveBeenCalledWith(optionsMock.payment);
    });

    it('should set submitInProgress to false and close the dialog with true on success', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.when(true));
      spyOn(dialogMock, 'close');
      scope.handleYes();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialogMock.close).toHaveBeenCalledWith(true);
    });

    it('should set submitInProgress to false on error and remain open', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.reject('fail'));
      spyOn(dialogMock, 'close');
      scope.handleYes();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialogMock.close).not.toHaveBeenCalled();
    });

    it('should expose the error on the scope as submitError', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.reject('Error 1234'));
      scope.handleYes();
      scope.$apply();
      expect(scope.submitError).toBe('Error 1234');
    });

    xit('should provide a default submitError if none is given', function () {
      spyOn(Payments, 'cancelScheduled').andReturn(q.reject());
      scope.handleYes();
      scope.$apply();
      expect(typeof scope.submitError).toBe('string');
    });

  });

});
