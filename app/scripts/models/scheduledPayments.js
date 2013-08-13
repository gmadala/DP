'use strict';

angular.module('nextgearWebApp')
  .factory('ScheduledPaymentsSearch', function(api) {

    var self = this;
    var PAGE_SIZE = 15;
    var lastRequest = null;

    self.request = function(request) {
      lastRequest = request;
      return api.request('GET', '/payment/searchscheduled', lastRequest).then(
        function(results) {
          var searchResults = [];

          for (var i = 0; i < results.SearchResults.length; i++) {
            var item = results.SearchResults[i];
            searchResults.push({
              vin: item.Vin,
              description: item.UnitDescription,
              stockNumber: item.StockNumber,
              status: self.toStatus(item.UnitStatusId),
              scheduledDate: self.toDateString(item.ScheduledPaymentDate),
              setupDate: self.toDateString(item.ScheduleSetupDate),
              payoffAmount: item.PrincipalPayoff,
              curtailmentAmount: item.AmountDue,
              scheduledBy: 'Michael Bluth' // TODO: Needs to be mapped to correct field
            });
          }
          return searchResults;
        }
      );
    };

    /**
     * Parses from string ISO 8601 format with the time
     * portion truncated (e.g. YYYY-MM-DD) and converts
     * it to D/MM/YYYY.
     */
    self.toDateString = function(str) {
      var tokens = str.split('-');
      var converted;

      if (tokens.length === 3) {
        converted = parseInt(tokens[2]) + '/' + tokens[1] + '/' + tokens[0];
      }
      else {
        console.error('Invalid date format. Expecting "YYYY-MM-DD".');
        converted = '';
      }
      return converted;
    };

    self.toStatus = function(statusId) {
      var status;

      switch (statusId) {

      default:
        status = "Pending";
      }
      return status;
    }

    return {
      FILTER_BY_ALL: '',
      FILTER_BY_SCHEDULED: 'scheduled',
      FILTER_BY_PROCESSED: 'processed',
      FILTER_BY_CANCELED: 'canceled',
      FILTER_BY_VOIDED: 'voided',

      search: function(query, dateStart, dateEnd, filterBy /*FILTER_BY_XXXX*/) {
        if (filterBy === null || filterBy === undefined || filterBy === '') {
          filterBy = this.FILTER_BY_ALL;
        }

        lastRequest = {
          OrderBy: 'ScheduledPaymentDate',
          PageNumber: 0,
          PageSize: PAGE_SIZE,
          Criteria: query,
          StartEnd: dateStart,
          EndDate: dateEnd,
          filterBy: filterBy
        };
        return self.request(lastRequest);
      },

      loadMoreData: function() {
        if (lastRequest === null) {
          return this.search();
        }
        else {
          lastRequest.PageNumber++;
          return self.request(lastRequest);
        }
      }
    };

  });
