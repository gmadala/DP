'use strict';

angular.module('nextgearWebApp')
  .factory('DealerNameSearch', function(api) {

    var PAGE_SIZE = 15;
    var totalCount = 0;
    var lastRequest = {
      OrderBy: 'BusinessName',
      OrderDirection: 'ASC',
      PageNumber: 1,
      PageSize: PAGE_SIZE,
      BusinessName: ''
    };

    /** PRIVATE METHODS **/
    var prv = {
      request: function(request) {
        lastRequest = request;
        return api.request('GET', '/dealer/search/buyer', lastRequest).then(
          function(results) {
            totalCount = results.DealerRowCount;
            return results.SearchResults;
          }
        );
      }
    };

    /** Public API **/
    return {
      search: function(name, city, state) {
        lastRequest = {
          OrderBy: 'BusinessName',
          OrderDirection: 'ASC',
          PageNumber: 1,
          PageSize: PAGE_SIZE,
          BusinessName: name
        };
        if (city) {
          lastRequest.City = city;
        }
        else if (state) {
          lastRequest.State = state;
        }
        else {
          // invalid scenario, fail early
          throw new Error('DealerSearch::search() - Must provide city or state');
        }
        return prv.request(lastRequest);
      },
      loadMoreData: function() {
        if (lastRequest === null) {
          return this.search();
        }
        else {
          lastRequest.PageNumber++;
          return prv.request(lastRequest);
        }
      },
      hasMoreData: function() {
        return lastRequest.PageNumber * PAGE_SIZE < totalCount;
      }
    };
  });
