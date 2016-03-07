'use strict';

angular.module('nextgearWebApp')
  .factory('DealerNameSearch', function(api, Paginate) {

    return {
      search: function(name, city, state, sortField, sortDesc, paginator) {
        var params = {
          BusinessName: name,
          City: city || undefined,
          StateId: state ? state.StateId : undefined,
          OrderBy: sortField,
          OrderByDirection: sortDesc ? 'DESC' : 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };

        if (!city && !state) {
          // invalid scenario, fail early
          throw new Error('DealerSearch::search() - Must provide city or state');
        }

        return api.request('GET', '/dealer/search/buyer', params).then(
          function(results) {
            angular.forEach(results.SearchResults, function (dealer) {
              dealer.data = {query: name};
            });
            return Paginate.addPaginator(results, results.DealerRowCount, params.PageNumber, params.PageSize);
          }
        );
      }
    };
  });
