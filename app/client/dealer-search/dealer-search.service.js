(function() {

  'use strict';

  angular.module('nextgearWebApp')
    .factory('dealerSearch', dealerSearch);

  dealerSearch.$inject = ['api', 'Paginate'];

  function dealerSearch(api, Paginate) {
    return {
      search: search,
      relateExternal: relateExternal
    };

    function search(query, auctionId, sortField, sortDesc, paginator) {

      // TODO: Need to change the search params passed to the backend.
      // This will not work because carmax will have alphanumeric business number
      var params = {
        lookupString: query,
        searchMode: 'B',
        pageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
        pageSize: Paginate.PAGE_SIZE_MEDIUM,
        sort: {},
        businessAuctionId: auctionId
      };
      params.sort[sortField] = sortDesc ? 'DESC' : 'ASC';

      return api.request('POST', api.ngenContentLink('/businesses/searchMobile'), params, null, true, handleNgenRequest).then(
        function(response) {
          var results = {
            SearchResults: response.data
          };
          angular.forEach(results.SearchResults, function(dealer) {
            dealer.data = {query: name};
          });
          return Paginate.addPaginator(results, response.headers('X-NGEN-Count'), params.pageNumber, params.pageSize);
        }
      );
    }

    function handleNgenRequest(response) {
      api.resetSessionTimeout();
      return response;
    }

    function relateExternal(dealerId, externalId, value) {
      var data = {
        auctionBusinessId: externalId,
        businessNumber: dealerId,
        externalId: value
      };
      return api.request('POST', api.ngenContentLink('/businesses/relate_external'), data, null, true, api.ngenSuccessHandler);
    }
  }

})();