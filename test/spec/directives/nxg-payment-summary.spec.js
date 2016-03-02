'use strict';

describe('Directive: nxgPaymentSummary', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxg-payment-summary/nxg-payment-summary.html'));

  var element;

  it('should create an isolate scope', inject(function ($rootScope, $compile) {
    element = angular.element('<section nxg-payment-summary></section>');
    element = $compile(element)($rootScope);
    expect(element.isolateScope()).not.toEqual($rootScope);
  }));

  describe('controller', function () {

    var scope,
      state,
      payments,
      mockPaymentQueue = {
        fees: {},
        payments: {}
      };

    beforeEach(inject(function ($rootScope, $controller, $state, Payments) {
      scope = $rootScope.$new();
      state = $state;
      payments = Payments;

      spyOn(Payments, 'getPaymentQueue').and.returnValue(mockPaymentQueue);

      $controller('PaymentSummaryCtrl', {
        $scope: scope
      });
    }));

    it('should attach the state transitionTo function to the scope', function () {
      expect(scope.navigate).toBe(state.transitionTo);
    });

    it('should attach the payment queue to the scope', function () {
      expect(scope.paymentQueue).toBe(mockPaymentQueue);
    });

    it('should attach a removePayment function to the scope that calls the corresponding model method', function () {
      var pmt = {
        id: 'someid'
      };
      spyOn(payments, 'removePaymentFromQueue');
      expect(typeof scope.removePayment).toBe('function');
      scope.removePayment(pmt);
      expect(payments.removePaymentFromQueue).toHaveBeenCalledWith(pmt.id);
    });

    it('should attach a removeFee function to the scope that calls the corresponding model method', function () {
      var fee = {
        financialRecordId: 'someid'
      };
      spyOn(payments, 'removeFeeFromQueue');
      expect(typeof scope.removeFee).toBe('function');
      scope.removeFee(fee);
      expect(payments.removeFeeFromQueue).toHaveBeenCalledWith(fee.financialRecordId);
    });

    it('should attach a getSubtotal function to the scope that sums items in the queue', function () {
      expect(scope.getSubtotal()).toBe(0);

      mockPaymentQueue.fees.fee1 = {
        getCheckoutAmount: function() {
          return 111;
        }
      };
      mockPaymentQueue.payments.payment1 = {
        getCheckoutAmount: function() {
          return 222;
        }
      };
      mockPaymentQueue.payments.payment2 = {
        getCheckoutAmount: function() {
          return 555.55;
        }
      };

      expect(scope.getSubtotal()).toBe(888.55);
    });

    it('should attach a getCount function to the scope that counts the items in the queue', function() {
      expect(scope.getCount()).toBe(3);
    })

  });

});
