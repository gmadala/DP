(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('DealerNumberSearch', DealerNumberSearch);

  DealerNumberSearch.$inject = ['api'];

  function DealerNumberSearch(api) {

    var prv = {
      createRequest: function() {
        return {
          PageNumber: 1,
          PageSize: 1
        };
      },
      search: function(req) {
        return  api.request('GET', '/dealer/search/buyer', req).then(
          function(results) {
            if (results.SearchResults && results.SearchResults.length > 0) {
              return results.SearchResults[0];
            }
            else {
              return null;
            }
          }
        );
      }
    };

    return {
      searchByDealerNumber: function(number) {
        var req = prv.createRequest();
        req.BusinessNumber = number;
        return prv.search(req);
      },
      searchByAuctionAccessNumber: function(number) {
        var req = prv.createRequest();
        req.AuctionAccessNumber  = number;
        return prv.search(req);
      }
    };

  }
})();
