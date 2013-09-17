'use strict';

angular.module('nextgearWebApp')
  .factory('ScheduledPaymentsSearch', function(api) {

    var self = this;
    var PAGE_SIZE = 15;
    var lastRequest = null;
    var totalCount = 0;

    self.request = function(request) {
      lastRequest = request;
      return api.request('GET', '/payment/searchscheduled', lastRequest).then(
        function(results) {
          var searchResults = [];
          totalCount = results.PaymentRowCount;

          for (var i = 0; i < results.SearchResults.length; i++) {
            var item = results.SearchResults[i];
            searchResults.push({
              floorplanId: item.FloorplanId,
              vin: item.Vin,
              description: item.VehicleDescription,
              stockNumber: item.StockNumber,
              status: self.toStatus(item),
              scheduledDate: item.ScheduledForDate,
              setupDate: item.SetupDate,
              canBePaidOff: self.isPending(item),
              isCurtailment: item.CurtailmentPayment,
              paymentAmount: item.ScheduledPaymentAmount,
              scheduledBy: item.ScheduledByUserDisplayname
            });
          }
          return searchResults;
        }
      );
    };

    self.isPending = function(item) {
      return !item.Processed && !item.Cancelled && !item.Voided;
    };

    self.toStatus = function(item) {
      var status;

      if (item.Processed) {
        status = 'Processed';
      }
      else if (item.Cancelled) {
        status = 'Cancelled';
      }
      else if (item.Voided) {
        status = 'Voided';
      }
      else {
        status = 'Pending';
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
        query = query || '';
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
