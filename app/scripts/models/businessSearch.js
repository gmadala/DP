'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessSearch', function(api, Paginate) {

    var sortableFields = ['BusinessName', 'LegalName', 'BusinessNumber', 'FederalTaxId', 'Line1', 'City', 'State', 'Zip'],
      getValidSortField = function (fieldName) {
        for (var i = 0; i < sortableFields.length; i++) {
          if (fieldName === sortableFields[i]) {
            return fieldName;
          }
        }
        return 'BusinessName'; // default value
      },
      isNumeric = function (value) {
        if (!value) {
          return false;
        }
        return (/^\d+$/).test(value.trim());
      };

    return {
      search: function (searchBuyers, query, sortField, sortDesc, paginator) {
        var url, countField,
          params = {
            OrderBy: getValidSortField(sortField),
            OrderDirection: sortDesc ? 'DESC' : 'ASC',
            PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            PageSize: Paginate.PAGE_SIZE_MEDIUM
          };

        if (searchBuyers) {
          url = '/dealer/search/buyer';
          countField = 'DealerRowCount';
          angular.extend(params, {
            BusinessName: isNumeric(query) ? undefined : query,
            BusinessNumber: isNumeric(query) ? query : undefined
          });
        } else {
          url = '/dealer/search/seller';
          countField = 'SellerCount';
          angular.extend(params, {
            SearchCriteria: query || undefined
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
