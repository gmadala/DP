'use strict';

describe('Directive: nxgUnappliedFundsWidget', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html'));

  var element,
    isolateScope;

  beforeEach(inject(function ($rootScope, $compile) {
    $rootScope.foo = 1;
    $rootScope.bar = 2;
    element = angular.element('<div nxg-unapplied-funds-widget balance="foo" available="bar"></div>');
    element = $compile(element)($rootScope);
    isolateScope = element.scope();
    $rootScope.$digest();
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
        dialog: function () {
          return {
            open: function () {
              return {
                then: angular.noop
              };
            }
          };
        },
        messageBox: function () {
          return {
            open: angular.noop
          };
        }
      };

      scope = $rootScope.$new();
      scope.fundsBalance = 500;
      scope.fundsAvail = 400;

      ctrl = $controller('UnappliedFundsWidgetCtrl', {
        $scope: scope,
        $dialog: dialogMock
      });
    }));

    it('should attach an openRequestPayout function to the scope', function () {
      expect(typeof scope.openRequestPayout).toBe('function');
    });

    it('openRequestPayout() should create a dialog with the right settings & data', function () {
      spyOn(dialogMock, 'dialog').andCallThrough();
      scope.openRequestPayout({preventDefault: angular.noop});
      var config = dialogMock.dialog.mostRecentCall.args[0];

      expect(config.templateUrl).toBeDefined();
      expect(config.controller).toBe('PayoutModalCtrl');

      var resolvedFunds = config.resolve.funds();
      expect(resolvedFunds.balance).toBe(500);
      expect(resolvedFunds.available).toBe(400);
    });

    it('openRequestPayout() should show a success modal and update available and total balance on success', function () {
      spyOn(dialogMock, 'dialog').andReturn({
        open: function () {
          return $q.when({
            amount: 100,
            account: {
              BankAccountName: 'foo',
              BankAccountId: 'fooId'
            },
            newAvailableAmount: 80
          });
        }
      });
      spyOn(dialogMock, 'messageBox').andCallThrough();
      scope.openRequestPayout({preventDefault: angular.noop});
      scope.$apply();
      expect(dialogMock.messageBox).toHaveBeenCalled();
      expect(typeof dialogMock.messageBox.mostRecentCall.args[0]).toBe('string');
      expect(dialogMock.messageBox.mostRecentCall.args[1]).toBe('Your request for a payout in the amount of ' +
        '$100.00 to your account "foo" has been successfully submitted.');
      expect(dialogMock.messageBox.mostRecentCall.args[2].length).toBe(1);

      expect(scope.fundsAvail).toBe(300);
      expect(scope.fundsBalance).toBe(400);
    });

  });

  describe('Payout modal controller', function () {

    var scope, payoutCtrl, paymentsMock, dialogMock, userMock, accts,
      flushPayoutRequestSuccess, flushPayoutRequestError, initCtrl;

    beforeEach(inject(function ($rootScope, $controller) {
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
        getStatics: function () {
          return {
            bankAccounts: accts
          };
        }
      };

      initCtrl = function () {
        scope = $rootScope.$new();
        payoutCtrl = $controller('PayoutModalCtrl', {
          $scope: scope,
          dialog: dialogMock,
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

    it('should attach the user model to the scope', function () {
      expect(scope.user).toBe(userMock);
    });

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
        spyOn(paymentsMock, 'requestUnappliedFundsPayout').andCallThrough();
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
        spyOn(paymentsMock, 'requestUnappliedFundsPayout').andCallThrough();
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
        expect(dialogMock.close.mostRecentCall.args[0].amount).toBe(100);
        expect(dialogMock.close.mostRecentCall.args[0].newAvailableAmount).toBe(80);
        expect(dialogMock.close.mostRecentCall.args[0].account.BankAccountId).toBe('fooId');
        expect(dialogMock.close.mostRecentCall.args[0].account.BankAccountName).toBe('foo');
      });

    });

  });

});
