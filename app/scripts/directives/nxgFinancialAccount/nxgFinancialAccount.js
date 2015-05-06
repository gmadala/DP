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
        console.log(scope.account);
      }
    };
  });

