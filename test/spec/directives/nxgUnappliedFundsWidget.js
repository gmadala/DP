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
            open: angular.noop
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

    var scope, payoutCtrl;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      payoutCtrl = $controller('PayoutModalCtrl', {
        $scope: scope,
        dialog: {
          close: angular.noop
        },
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
        }
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

  });

});
