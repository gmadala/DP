(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgPaymentSummary', nxgPaymentSummary);

  nxgPaymentSummary.$inject = [];

  function nxgPaymentSummary() {

    return {
      templateUrl: 'scripts/directives/nxgPaymentSummary/nxgPaymentSummary.html',
      restrict: 'A',
      scope: {
        emptyMessage: '@'
      },
      controller: 'PaymentSummaryCtrl'
    };

  }
})();
