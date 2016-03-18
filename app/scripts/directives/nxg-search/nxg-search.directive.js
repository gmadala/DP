(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgSearch', nxgSearch);

  nxgSearch.$inject = [];

  function nxgSearch() {

    return {
      templateUrl: 'scripts/directives/nxg-search/nxg-search.html',
      scope: {
        title: '@',
        prompt: '@',
        filterLabel: '@',
        filterOptions: '=', // array of objects with properties label, value
        activeCriteria: '=', // object with properties: query, startDate, endDate, filter, inventoryLocation
        showDateRange: '&',
        onSearch: '&',
        onClear: '&',
        filterable: '=',
        helpText: '@',
        info: '@',
        locs: '=showLocationFilter' // whether to display the filter for inventory location
      },
      controller: 'NxgSearchCtrl'
    };

  }
})();
