'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api, moment, Paginate, Floorplan) {

    return {
      requestUnappliedFundsPayout: function (amount, bankAccountId) {
        return api.request('POST', '/payment/payoutUnappliedFunds', {
          RequestAmount: amount,
          BankAccountId: bankAccountId
        });
      },
      filterValues: {
        ALL: 'all',
        TODAY: 'today',
        THIS_WEEK: 'thisWeek',
        RANGE: 'range'
      },
      search: function(criteria, paginator) {
        criteria = angular.copy(criteria);
        switch (criteria.filter) {
        case 'all':
          criteria.startDate = criteria.endDate = null;
          break;
        case 'today':
          criteria.startDate = criteria.endDate = new Date();
          break;
        case 'thisWeek':
          criteria.startDate = moment().startOf('week').toDate();
          criteria.endDate = moment().endOf('week').toDate();
        // case 'range': use whatever dates were entered by user
        }

        var params = {
          Criteria: criteria.query || undefined,
          DueDateStart: api.toShortISODate(criteria.startDate) || undefined,
          DueDateEnd: api.toShortISODate(criteria.endDate) || undefined,
          OrderBy: 'DueDate',
          OrderDirection: 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };
        return api.request('GET', '/payment/search', params).then(
          function (results) {
            angular.forEach(results.SearchResults, function (payment) {
                Floorplan.addTitleURL(payment);
              });
            return Paginate.addPaginator(results, results.PaymentRowCount, params.PageNumber, params.PageSize);
          }
        );
      }
    };
  });
