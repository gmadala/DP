'use strict';

describe('Controller: CancelFeeCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var CancelFeeCtrl,
    scope,
    optionsMock,
    dialogMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    optionsMock = {
      fee: {
        webScheduledAccountFeeId: 'schedFeeId',
        financialRecordId: '12345',
        description: 'some description',
        feeType: 'account fee',
        scheduledDate: '2010-10-10',
        balance: 1000
      },
      title: 'some title',
      onCancel: angular.noop
    };
    dialogMock = {
      close: angular.noop
    };

    CancelFeeCtrl = $controller('CancelFeeCtrl', {
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

  it('should use a default title if none is provided', inject(function($controller) {
    optionsMock.title = '';
    CancelFeeCtrl = $controller('CancelFeeCtrl', {
      $scope: scope,
      dialog: dialogMock,
      options: optionsMock
    });
    expect(scope.title).toBe('Cancel Fee');
  }));

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
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.when(true));
      scope.handleYes();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should call cancelScheduledFee in payments model with scheduled account fee id of provided fee', function () {
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.when(true));
      scope.handleYes();
      expect(Payments.cancelScheduledFee).toHaveBeenCalledWith('schedFeeId');
    });

    it('should set submitInProgress to false and close the dialog with true on success', function () {
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.when(true));
      spyOn(dialogMock, 'close');
      scope.handleYes();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialogMock.close).toHaveBeenCalledWith(true);
    });

    it('should call the onCancel function, if defined, on success', function () {
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.when(true));
      spyOn(optionsMock, 'onCancel');

      scope.handleYes();
      scope.$apply();
      expect(optionsMock.onCancel).toHaveBeenCalled();
    });

    it('should not blow up on success if onCancel is not defined in the options', function () {
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.when(true));
      optionsMock.onCancel = undefined;

      scope.handleYes();
      expect(function () {
        scope.$apply();
      }).not.toThrow();
    });

    it('should set submitInProgress to false on error and remain open', function () {
      spyOn(Payments, 'cancelScheduledFee').andReturn(q.reject('fail'));
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
