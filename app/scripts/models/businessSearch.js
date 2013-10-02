'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessSearch', function(api, Paginate) {

    var sortableFields = ['BusinessName', 'LegalName', 'BusinessNumber', 'FederalTaxId', 'Line1', 'City', 'State', 'Zip'],
      getValidSortField = function(fieldName) {
        for (var i = 0; i < sortableFields.length; i++) {
          if (fieldName === sortableFields[i]) {
            return fieldName;
          }
        }
        return 'BusinessName'; // default value
      };

    return {
      searchSeller: function(query, sortField, sortDesc, paginator) {
        var params = {
          SearchCriteria: query || undefined,
          OrderBy: getValidSortField(sortField),
          OrderDirection: sortDesc ? 'DESC' : 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };
        return api.request('GET', '/dealer/search/seller', params).then(
          function(results) {
            return Paginate.addPaginator(results, results.SellerCount, params.PageNumber, params.PageSize);
          });
      }
    };
  });
