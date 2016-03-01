(function() {

  'use strict';

  angular.module('nextgearWebApp')
    .factory('dealerSearch', dealerSearch);

  dealerSearch.$inject = ['api', 'Paginate'];

  function dealerSearch(api, Paginate) {
    return {
      search: search
    };

    function search(query, sortField, sortDesc, paginator) {

      // TODO: Need to change the search params passed to the backend.
      // This will not work because carmax will have alphanumeric business number
      var params = {
        BusinessName: isNumeric(query) ? undefined : (query || undefined),
        BusinessNumber: isNumeric(query) ? query : undefined,
        OrderBy: sortField,
        OrderByDirection: sortDesc ? 'DESC' : 'ASC',
        PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
        PageSize: Paginate.PAGE_SIZE_MEDIUM
      };

      return api.request('GET', '/dealer/search/buyer', params).then(
        function(results) {
          angular.forEach(results.SearchResults, function(dealer) {
            dealer.data = {query: name};
          });
          return Paginate.addPaginator(results, results.DealerRowCount, params.PageNumber, params.PageSize);
        }
      );
    }

    function isNumeric(value) {
      if (!value) {
        return false;
      }
      return (/^\d+$/).test(value.trim());
    }
  }

})();