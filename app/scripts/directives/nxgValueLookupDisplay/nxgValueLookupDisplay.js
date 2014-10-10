'use strict';

angular.module('nextgearWebApp')
  .directive('nxgValueLookupDisplay', function () {
    return {
      templateUrl: 'scripts/directives/nxgValueLookupDisplay/nxgValueLookupDisplay.html',
      restrict: 'A',
      replace: true,
      scope: {
        value: '=nxgValueLookupDisplay',
        searchDone: '&',
        noResults: '='
      },
      link: function(scope) {
        // determine if there is data (either a value or 'n/a')
        // to show; ie. we have run a search and have at least
        // one result
        scope.dataAvailable = function() {
          return scope.searchDone() && !scope.noResults;
        };
      }
    };
  });
