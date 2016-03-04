(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .service('paymentOptionsHelper', paymentOptionsHelperFn);

  paymentOptionsHelperFn.$inject = ['CartItem'];

  function paymentOptionsHelperFn(CartItem) {

    var paymentOptionsHelper = {
      fromCartItem: function(cartItem) {
        return angular.copy(cartItem);
      },
      fromVehicleDetails: function(object) {
        return CartItem.fromPayment(object, null);
      }
    };

    return paymentOptionsHelper;

  }
})();
