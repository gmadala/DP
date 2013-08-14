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
              floorplanId: item.FloorplanId,
              vin: item.Vin,
              description: item.UnitDescription,
              stockNumber: item.StockNumber,
              status: self.toStatus(item.UnitStatusId),
              scheduledDate: item.ScheduledPaymentDate,
              setupDate: item.ScheduleSetupDate,
              canBePaidOff: item.PayPayoffAmount,
              payoffAmount: item.PrincipalPayoff,
              curtailmentAmount: item.AmountDue,
              scheduledBy: 'Michael Bluth' // TODO: Needs to be mapped to correct field
            });
          }
          return searchResults;
        }
      );
    };

    self.toStatus = function(statusId) {
      var status;

      switch (statusId) {
      default:
        status = 'scheduled';
      }
      return status;
    };

    return {
      // TODO: Confirm with API spec (once complete) if this is the filter types the service will expect.
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
