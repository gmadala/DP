(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgRequestsSummary', nxgRequestsSummary);

  nxgRequestsSummary.$inject = [];

  function nxgRequestsSummary() {

    return {
      templateUrl: 'scripts/directives/nxgRequestsSummary/nxgRequestsSummary.html',
      restrict: 'A',
      scope: {
        eligibility: '='
      },
      controller: 'RequestsSummaryCtrl'
    };

  }
})();
