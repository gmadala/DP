(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgUnappliedFundsWidget', nxgUnappliedFundsWidget);

  nxgUnappliedFundsWidget.$inject = [];

  function nxgUnappliedFundsWidget() {

    return {
      templateUrl: 'client/shared/directives/nxg-unapplied-funds-widget/nxg-unapplied-funds-widget.html',
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
