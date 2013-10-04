'use strict';

angular.module('nextgearWebApp')
  .factory('Receipts', function receipts($q, api, Paginate) {
    return {
      search: function (criteria, paginator) {
        var self = this,
          params = {
            Keyword: criteria.query || undefined,
            PaymentMethods: criteria.filter,
            StartDate: api.toShortISODate(criteria.startDate) || undefined,
            EndDate: api.toShortISODate(criteria.endDate) || undefined,
            OrderBy: 'CreateDate',
            OrderByDirection: 'DESC',
            PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            PageSize: Paginate.PAGE_SIZE_MEDIUM
          };
        return api.request('GET', '/receipt/search', params).then(
          function (results) {
            angular.forEach(results.Receipts, function (receipt) {
              receipt.$receiptURL = self.getReceiptUrl(receipt.FinancialTransactionId);
            });
            return Paginate.addPaginator(results, results.ReceiptRowCount, params.PageNumber, params.PageSize);
          }
        );
      },
      getReceiptUrl: function (transactionId) {
        return api.contentLink('/receipt/view/' + transactionId);
      }
    };
  });
