(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgRequestsSummary', nxgRequestsSummary);

  nxgRequestsSummary.$inject = [];

  function nxgRequestsSummary() {

    return {
      templateUrl: 'scripts/directives/nxg-requests-summary/nxg-requests-summary.html',
      restrict: 'A',
      scope: {
        eligibility: '='
      },
      controller: 'RequestsSummaryCtrl'
    };

  }
})();
