'use strict';

describe('Directive: nxgUnappliedFundsWidget', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html'));

  var element,
    isolateScope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div nxg-unapplied-funds-widget></div>');
    element = $compile(element)($rootScope);
    isolateScope = element.scope();
  }));

  it('should create a new scope', inject(function ($rootScope) {
    expect(isolateScope).not.toBe($rootScope);
  }));

  describe('main controller', function () {

    var scope, ctrl, dialogMock, httpBackend;

    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
      httpBackend = $httpBackend;
      httpBackend.whenGET('/payment/info').respond({
        Success: true,
        Data: {
          UnappliedFundsBalance: 1,
          AvailableUnappliedFundsBalance: 2
        }
      });

      dialogMock = {
        dialog: function () {
          return {
            open: function () {
              return {
                then: angular.noop
              };
            }
          };
        }
      }

      scope = $rootScope.$new();
      ctrl = $controller('UnappliedFundsWidgetCtrl', {
        $scope: scope,
        $dialog: dialogMock
      });
    }));

    it('should attach an unappliedFunds object to the scope', function () {
      expect(scope.unappliedFunds).toBeDefined();
    });

    it('should attach an openRequestPayout function to the scope', function () {
      expect(typeof scope.openRequestPayout).toBe('function');
    });

    it('openRequestPayout() should create a dialog with the right settings & data', function () {
      spyOn(dialogMock, 'dialog').andCallThrough();
      scope.openRequestPayout({preventDefault: angular.noop});
      var config = dialogMock.dialog.mostRecentCall.args[0];

      expect(config.templateUrl).toBeDefined();
      expect(config.controller).toBe('PayoutModalCtrl');

      var resolvedFunds = {};
      config.resolve.funds().then(function (value) {
        resolvedFunds = value;
      });
      httpBackend.flush();
      expect(resolvedFunds.balance).toBe(1);
      expect(resolvedFunds.available).toBe(2);
    });

  });

  describe('Payout modal controller', function () {

    var scope, payoutCtrl, paymentsMock, dialogMock,
      flushPayoutRequestSuccess, flushPayoutRequestError;

    beforeEach(inject(function ($rootScope, $controller) {
      paymentsMock = {
        requestUnappliedFundsPayout: function (amount, accountId) {
          return {
            then: function (success, error) {
              flushPayoutRequestSuccess = function () {
                success();
              };
              flushPayoutRequestError = function (value) {
                error(value);
              };
            }
          };
        }
      };

      dialogMock = {
        close: angular.noop
      };

      scope = $rootScope.$new();
      payoutCtrl = $controller('PayoutModalCtrl', {
        $scope: scope,
        dialog: dialogMock,
        funds: {
          balance: 1,
          available: 2
        },
        User: {
          getStatics: function () {
            return {
              BankAccounts: {
                id1: 'name1',
                id2: 'name2'
              }
            };
          }
        },
        Payments: paymentsMock
      });

    }));

    it('should attach the list of accounts to the scope', function () {
      var accountMock = {
        id1: 'name1',
        id2: 'name2'
      };
      expect(angular.equals(scope.accounts, accountMock)).toBe(true);
    });

    it('should attach the funds object to the scope', function () {
      var fundsMock = {
        balance: 1,
        available: 2
      };
      expect(angular.equals(scope.funds, fundsMock)).toBe(true);
    });

    describe('submit function', function () {

      it('should send along the expected data', function () {
        spyOn(paymentsMock, 'requestUnappliedFundsPayout').andCallThrough();
        scope.selections = {
          amount: 100,
          accountId: 'foo'
        };
        scope.submit();
        expect(paymentsMock.requestUnappliedFundsPayout).toHaveBeenCalledWith(100, 'foo');
      });

      it('should update the submitInProgress flag', function () {
        scope.submit();
        expect(scope.submitInProgress).toBe(true);
        flushPayoutRequestSuccess();
        expect(scope.submitInProgress).toBe(false);

        scope.submit();
        expect(scope.submitInProgress).toBe(true);
        flushPayoutRequestError();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should expose any error on the scope', function () {
        scope.submit();
        expect(scope.submitError).toBe(null);
        flushPayoutRequestError('10876');
        expect(scope.submitError).toBe('10876');
      });

      it('should close the dialog with submitted data on success', function () {
        spyOn(dialogMock, 'close');
        scope.accounts = {
          foo: 'BofA',
          foo2: 'Chase'
        };
        scope.selections = {
          amount: 100,
          accountId: 'foo2'
        };
        scope.submit();
        flushPayoutRequestSuccess();
        expect(dialogMock.close).toHaveBeenCalled();
        expect(dialogMock.close.mostRecentCall.args[0].amount).toBe(100);
        expect(dialogMock.close.mostRecentCall.args[0].accountId).toBe('foo2');
        expect(dialogMock.close.mostRecentCall.args[0].accountName).toBe('Chase');
      });

    });

  });

});
