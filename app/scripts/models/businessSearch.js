'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessSearch', function(api, Paginate) {

    var isNumeric = function (value) {
      if (!value) {
        return false;
      }
      return (/^\d+$/).test(value.trim());
    };

    return {
      search: function (searchBuyers, query, sortField, sortDesc, paginator) {
        var url, countField,
          params = {
            OrderBy: sortField,
            PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            PageSize: Paginate.PAGE_SIZE_MEDIUM
          };

        if (searchBuyers) {
          url = '/dealer/search/buyer';
          countField = 'DealerRowCount';
          angular.extend(params, {
            BusinessName: isNumeric(query) ? undefined : (query || undefined),
            BusinessNumber: isNumeric(query) ? query : undefined,
            OrderByDirection: sortDesc ? 'DESC' : 'ASC'
          });
        } else {
          url = '/dealer/search/seller';
          countField = 'SellerCount';
          angular.extend(params, {
            SearchCriteria: query || undefined,
            OrderByDirection: sortDesc ? 'DESC' : 'ASC'
          });
        }

        return api.request('GET', url, params).then(
          function(results) {
            return Paginate.addPaginator(results, results[countField], params.PageNumber, params.PageSize);
          }
        );
      }
    };
  });
