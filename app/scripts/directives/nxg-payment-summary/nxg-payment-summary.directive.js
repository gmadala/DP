(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgPaymentSummary', nxgPaymentSummary);

  nxgPaymentSummary.$inject = [];

  function nxgPaymentSummary() {

    return {
      templateUrl: 'scripts/directives/nxg-payment-summary/nxg-payment-summary.html',
      restrict: 'A',
      scope: {
        emptyMessage: '@'
      },
      controller: 'PaymentSummaryCtrl'
    };

  }
})();
