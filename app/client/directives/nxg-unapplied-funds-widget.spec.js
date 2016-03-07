'use strict';

describe('Directive: nxgUnappliedFundsWidget', function () {
  beforeEach(module('nextgearWebApp', 'client/directives/nxg-unapplied-funds-widget/nxg-unapplied-funds-widget.html'));

  var element,
    isolateScope;

  beforeEach(inject(function ($rootScope, $compile, $httpBackend, $q) {
    $httpBackend.expectGET('client/directives/nxg-icon/nxg-icon.html').respond('<div></div>');
    $httpBackend.whenGET('/userAccount/v1_1/settings').respond($q.when({
      AutoDisburseUnappliedFundsDaily: false
    }));
    $rootScope.foo = 1;
    $rootScope.bar = 2;
    element = angular.element('<div nxg-unapplied-funds-widget balance="foo" available="bar"></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    isolateScope = element.isolateScope();
  }));

  it('should create a new scope', inject(function ($rootScope) {
    expect(isolateScope).not.toBe($rootScope);
  }));

  it('should expose the balance and available values onto the isolate scope', function () {
    expect(isolateScope.fundsBalance).toBe(1);
    expect(isolateScope.fundsAvail).toBe(2);
  });

  describe('main controller', function () {

    var scope, ctrl, dialogMock, $q;

    beforeEach(inject(function ($rootScope, $controller, _$q_) {
      $q = _$q_;
      dialogMock = {
        open: function() {
          return {
            result: {
              then: function (callback) {
                callback();
              }
            }
          }
        }
      };

      scope = $rootScope.$new();
      scope.fundsBalance = 500;
      scope.fundsAvail = 400;

      ctrl = $controller('UnappliedFundsWidgetCtrl', {
        $scope: scope,
        $uibModal: dialogMock
      });
    }));

    it('should attach an openRequestPayout function to the scope', function () {
      expect(typeof scope.openRequestPayout).toBe('function');
    });

    it('openRequestPayout() should create a dialog with the right settings & data', function () {
      spyOn(dialogMock, 'open').and.callThrough();
      scope.openRequestPayout({preventDefault: angular.noop});
      var config = dialogMock.open.calls.mostRecent().args[0];

      expect(config.templateUrl).toBeDefined();
      expect(config.controller).toBe('PayoutModalCtrl');

      var resolvedFunds = config.resolve.funds();
      expect(resolvedFunds.balance).toBe(500);
      expect(resolvedFunds.available).toBe(400);
    });

    it('openRequestPayout() should show a success modal and update available and total balance on success', function () {
      spyOn(dialogMock, 'open').and.returnValue({
        result: {
          then: function () {
            return $q.when({
              amount: 100,
              account: {
                BankAccountName: 'foo',
                BankAccountId: 'fooId'
              },
              newAvailableAmount: 80
            });
          }
        }
      });
      //spyOn(dialogMock, 'open').and.callThrough();
      scope.openRequestPayout({preventDefault: angular.noop});
      scope.$apply();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(typeof dialogMock.open.calls.mostRecent().args[0]).toBe('object');
      expect(scope.fundsAvail).toBe(400);
      expect(scope.fundsBalance).toBe(500);
    });

    it('openRequestPayout() should not do anything if not successful', function() {
      spyOn(dialogMock, 'open').and.returnValue({
        open: angular.noop
      });
      // scope.openRequestPayout({preventDefault: angular.noop});
      scope.$apply();
      expect(dialogMock.open).not.toHaveBeenCalled();
    })

  });

  describe('Payout modal controller', function () {

    var scope, payoutCtrl, paymentsMock, dialogMock, userMock, accts,
      flushPayoutRequestSuccess, flushPayoutRequestError, initCtrl, $q;

    beforeEach(inject(function ($rootScope, $controller, _$q_) {
      $q = _$q_;
      paymentsMock = {
        requestUnappliedFundsPayout: function (amount, accountId) {
          return {
            then: function (success, error) {
              flushPayoutRequestSuccess = function () {
                success({BalanceAfter: 80});
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

      accts = [
        {
          BankAccountName: 'name1',
          BankAccountId: 'id1'
        },
        {
          BankAccountName: 'name2',
          BankAccountId: 'id2'
        }
      ];

      userMock = {
        getInfo: function () {
          return $q.when({
            BankAccounts: accts
          });
        }
      };

      initCtrl = function () {
        scope = $rootScope.$new();
        payoutCtrl = $controller('PayoutModalCtrl', {
          $scope: scope,
          $uibModalInstance: dialogMock,
          funds: {
            balance: 1,
            available: 2
          },
          User: userMock,
          Payments: paymentsMock
        });
      };
      initCtrl();

    }));

    it('should attach the funds object to the scope', function () {
      var fundsMock = {
        balance: 1,
        available: 2
      };
      expect(angular.equals(scope.funds, fundsMock)).toBe(true);
    });

    it('should attach a selections model to the scope', function () {
      expect(scope.selections).toBeDefined();
      expect(scope.selections.amount).toBeDefined();
      expect(scope.selections.account).toBeDefined();
    });

    it('should default amount to null', function () {
      expect(scope.selections.amount).toBe(null);
    });

    it('should default account to null if there is more than one', function () {
      expect(scope.selections.account).toBe(null);
    });

    it('should default account to the account if there is only one', function () {
      var myOnlyAcct = {
        BankAccountName: 'name2',
        BankAccountId: 'id2'
      };
      accts = [ myOnlyAcct ];
      initCtrl();
      scope.$apply();
      scope.$digest();
      expect(scope.selections.account).toBe(myOnlyAcct);
    });

    describe('submit function', function () {
      // mock up a form controller on the scope
      var form;
      beforeEach(function () {
        form = {
          $valid: true
        };
        scope.form = form;
        scope.selections = {
          amount: 100,
          account: {
            BankAccountName: 'foo',
            BankAccountId: 'fooId'
          }
        };
      });

      it('should expose a snapshot copy of the form controller\'s state on the scope', function () {
        scope.submit();
        expect(angular.equals(scope.validity, scope.form)).toBe(true);
      });

      it('should not submit if there are local validation errors', function () {
        spyOn(paymentsMock, 'requestUnappliedFundsPayout').and.callThrough();
        scope.form = {
          $valid: false,
          payoutAmt: {
            $error: {
              required: true
            }
          },
          payoutBankAcct: {
            $error: {}
          }
        };
        scope.submit();
        expect(paymentsMock.requestUnappliedFundsPayout).not.toHaveBeenCalled();
      });

      it('should send along the expected data', function () {
        spyOn(paymentsMock, 'requestUnappliedFundsPayout').and.callThrough();
        scope.submit();
        expect(paymentsMock.requestUnappliedFundsPayout).toHaveBeenCalledWith(100, 'fooId');
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

      it('should close the dialog with submitted/result data on success', function () {
        spyOn(dialogMock, 'close');
        scope.submit();
        flushPayoutRequestSuccess();
        expect(dialogMock.close).toHaveBeenCalled();
        expect(dialogMock.close.calls.mostRecent().args[0].amount).toBe(100);
        expect(dialogMock.close.calls.mostRecent().args[0].newAvailableAmount).toBe(80);
        expect(dialogMock.close.calls.mostRecent().args[0].account.BankAccountId).toBe('fooId');
        expect(dialogMock.close.calls.mostRecent().args[0].account.BankAccountName).toBe('foo');
      });

    });

    describe('cancel function', function() {
      it('should exist', function() {
        expect(scope.cancel).toBeDefined();
        expect(typeof scope.cancel).toBe('function');
      });

      it('should close the dialog', function() {
        spyOn(dialogMock, 'close');
        scope.cancel();
        scope.$apply();
        expect(dialogMock.close).toHaveBeenCalled();
      })
    });

  });

});
