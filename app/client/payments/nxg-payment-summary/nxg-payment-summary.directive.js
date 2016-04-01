(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgPaymentSummary', nxgPaymentSummary);

  nxgPaymentSummary.$inject = [];

  function nxgPaymentSummary() {

    return {
      templateUrl: 'client/payments/nxg-payment-summary/nxg-payment-summary.template.html',
      restrict: 'A',
      scope: {
        emptyMessage: '@'
      },
      controller: 'PaymentSummaryCtrl'
    };

  }
})();
