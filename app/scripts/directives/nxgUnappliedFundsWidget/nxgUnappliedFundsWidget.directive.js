(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgUnappliedFundsWidget', nxgUnappliedFundsWidget);

  nxgUnappliedFundsWidget.$inject = [];

  function nxgUnappliedFundsWidget() {

    return {
      templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html',
      restrict: 'AC',
      replace: true,
      scope: {
        fundsBalance: '=balance',
        fundsAvail: '=available'
      },
      controller: 'UnappliedFundsWidgetCtrl'
    };

  }
})();
