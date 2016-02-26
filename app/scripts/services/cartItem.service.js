(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .service('CartItem', CartItem);

  CartItem.$inject = ['VehicleCartItem', 'FeeCartItem', 'PaymentOptions'];

  function CartItem(VehicleCartItem, FeeCartItem, PaymentOptions) {

    var CartItem = {
      fromPayment: function(p, paymentType) {
        return new VehicleCartItem(p, paymentType);
      },
      fromScheduledPayment: function(sp) {
        var scheduledPayment = {
          FloorplanId: sp.floorplanId,
          StockNumber: sp.stockNumber,
          Vin: sp.vin,
          UnitDescription: sp.description,
          DueDate: sp.curtailmentDueDate,
          ScheduledPaymentDate: sp.scheduledDate,
          ScheduledPaymentAmount: sp.scheduledPaymentAmount,
          CurrentPayoff: sp.payoffAmount,
          PrincipalPayoff: sp.principalPayoff,
          FeesPayoffTotal: sp.FeesPayoffTotal,
          InterestPayoffTotal: sp.InterestPayoffTotal,
          CollateralProtectionPayoffTotal: sp.CollateralProtectionPayoffTotal,
          AmountDue: sp.PrincipalDue + sp.FeesPayoffTotal + sp.InterestPayoffTotal + sp.CollateralProtectionPayoffTotal,
          PrincipalDue: sp.PrincipalDue,
          FeesPaymentTotal: sp.FeesPayoffTotal,
          InterestPaymentTotal: sp.InterestPayoffTotal,
          CollateralProtectionPaymentTotal: sp.CollateralProtectionPayoffTotal
        };
        // Has to be a payoff initially, because when we add a payment
        // from the scheduled payments page it is via the "Payoff Now" button.
        return new VehicleCartItem(scheduledPayment, PaymentOptions.TYPE_PAYOFF);
      },
      fromFee: function(f) {
        return new FeeCartItem(f);
      }
    };

    return CartItem;

  }
})();
