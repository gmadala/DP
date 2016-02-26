(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .service('paymentOptionsHelper', paymentOptionsHelper);

  paymentOptionsHelper.$inject = ['CartItem'];

  function paymentOptionsHelper(CartItem) {

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
