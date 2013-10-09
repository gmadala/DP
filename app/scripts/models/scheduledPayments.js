'use strict';

angular.module('nextgearWebApp')
  .factory('ScheduledPaymentsSearch', function(api) {

    var PAGE_SIZE = 15;
    var lastRequest = null;
    var totalCount = 0;

    var prv = {
      request: function(request) {
        lastRequest = request;
        return api.request('GET', '/payment/searchscheduled', lastRequest).then(
          function(results) {
            var searchResults = [];
            totalCount = results.PaymentRowCount;

            for (var i = 0; i < results.SearchResults.length; i++) {
              var item = results.SearchResults[i];
              searchResults.push({
                floorplanId: item.FloorplanId,
                financialTransactionId: item.FinancialTransactionId,
                vin: item.Vin,
                description: item.VehicleDescription,
                stockNumber: item.StockNumber,
                status: prv.toStatus(item),
                statusDate: prv.getStatusDate(item),
                scheduledDate: item.ScheduledForDate,
                isPending: prv.isPending(item),
                isCancelled: item.Cancelled,
                isVoided: item.Voided,
                isProcessed: item.Processed,
                isCurtailment: item.CurtailmentPayment,
                paymentAmount: item.ScheduledPaymentAmount,
                payoffAmount: item.ScheduledPayoutAmount,
                scheduledBy: item.ScheduledByUserDisplayname,
                receiptURL: prv.getReceiptURL(item),
                data: {query: request.Keyword}
              });
            }
            return searchResults;
          }
        );
      },

      getReceiptURL: function(item) {
        return api.contentLink('/receipt/view/' + item.FinancialTransactionId);
      },

      isPending: function(item) {
        return !item.Processed && !item.Cancelled && !item.Voided;
      },

      toStatus: function(item) {
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
      },

      getStatusDate: function(item) {
        var date = '';

        if (item.Processed) {
          date = item.ProcessedOnDate;
        }
        else if (item.Cancelled) {
          date = item.CancelledDate;
        }
        else if (item.Voided) {
          date = item.VoidedDate;
        }
        else {
          date = item.SetupDate;
        }
        return date;
      }
    };

    return {
      FILTER_BY_ALL: 0,
      FILTER_BY_PENDING: 1,
      FILTER_BY_PROCESSED: 2,
      FILTER_BY_CANCELED: 3,
      FILTER_BY_VOIDED: 4,

      search: function(query, dateStart, dateEnd, filterBy /*FILTER_BY_XXXX*/) {
        query = query || '';

        if (filterBy === null || filterBy === undefined || filterBy === '') {
          filterBy = this.FILTER_BY_ALL;
        }

        lastRequest = {
          OrderBy: 'UnitStatus',
          OrderDirection: 'ASC',
          PageNumber: 1,
          PageSize: PAGE_SIZE,
          Keyword: query,
          StartDate: dateStart,
          EndDate: dateEnd,
          SearchCancelled: false,
          SearchPending: false,
          SearchProcessed: false,
          SearchVoided: false
        };
        // set up filters
        switch (filterBy) {
        case this.FILTER_BY_PENDING:
          lastRequest.SearchPending = true;
          break;
        case this.FILTER_BY_PROCESSED:
          lastRequest.SearchProcessed = true;
          break;
        case this.FILTER_BY_CANCELED:
          lastRequest.SearchCancelled = true;
          break;
        case this.FILTER_BY_VOIDED:
          lastRequest.SearchVoided = true;
          break;
        default:
          // Show all scheduled payments of all statuses
          lastRequest.SearchPending = true;
          lastRequest.SearchProcessed = true;
          lastRequest.SearchCancelled = true;
          lastRequest.SearchVoided = true;
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
      }
    };

  });
