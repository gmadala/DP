'use strict';

angular.module('nextgearWebApp')
  .directive('nxgFinancialAccount', function() {
    return {
      templateUrl: 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
      replace: true,
      scope: {
        account: '='
      },
      restrict: 'E',
      link: function(scope/*, element, attr */) {
        var generateDefaults = function () {
          var defaults = [];
          if (scope.account.PrimaryPayment) {
            defaults.push('Default Payment');
          }
          if (scope.account.PrimaryDisbursement) {
            defaults.push('Default Disbursement');
          }
          return defaults.join(', ');
        };
        scope.defaults = generateDefaults();
      }
    };
  });

