'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessSearch', function(api) {

    var prv = this,
      resultCount = 0,
      PAGE_SIZE = 15,
      ORDER_BY_FIELDS = ['BusinessName', 'LegalName', 'BusinessNumber', 'FederalTaxId', 'Line1', 'City', 'State', 'Zip'],
      request = {
        SearchCriteria: '',
        OrderBy: 'BusinessName',
        OrderDirection: 'ASC',
        PageNumber: 0,
        PageSize: PAGE_SIZE
      };

    prv.createQuery = function(request) {
      var str = '';
      for(var propName in request) {
        // builds up the URL query e.g. ?field1=value1&field2=value2&field3=value3...
        str += (str.length === 0 ? '?' : '&') + propName + '=' + request[propName];
      }
      return str;
    };

    prv.sendRequest = function() {
      return api.request('GET', '/dealer/search/seller' + prv.createQuery(request))
        .then(function(results) {
          resultCount = results.SellerCount;
          return results;
        });
    };

    prv.getValidOrderByField = function(fieldName) {
      for (var i = 0; i < ORDER_BY_FIELDS.length; i++) {
        if (fieldName === ORDER_BY_FIELDS[i]) {
          return fieldName;
        }
      }
      return 'BusinessName'; // default value
    };

    return {
      searchSeller: function(query) {
        query = query || '';
        request = {
          SearchCriteria: query,
          OrderBy: 'BusinessName',
          OrderDirection: 'ASC',
          PageNumber: 0,
          PageSize: PAGE_SIZE
        };
        return prv.sendRequest();
      },

      hasMoreData: function() {
        return request.PageSize * request.PageNumber < resultCount;
      },

      loadMoreData: function() {
        if (this.hasMoreData()) {
          // we got more data to load
          request.PageNumber++;
          return prv.sendRequest();
        }
      },

      sortBy: function(fieldName) {
        request.PageNumber = 0;
        request.OrderBy = prv.getValidOrderByField(fieldName);
        prv.sendRequest();
      }
    };
  });
