'use strict';

angular.module('nextgearWebApp')
  .factory('Floorplan', function(api, Paginate) {
    return {
      create: function(data) {
        // transform data types as needed for API
        data = angular.copy(data);

        angular.extend(data, {
          // boolean
          PaySeller: api.toBoolean(data.PaySeller),
          SaleTradeIn: api.toBoolean(data.SaleTradeIn),
          VinAckLookupFailure: api.toBoolean(data.VinAckLookupFailure),
          // int
          UnitYear: api.toInt(data.UnitYear),
          // date
          UnitPurchaseDate: api.toUTCShortISODate(data.UnitPurchaseDate),
          // option object values that need flattened to ids
          UnitColorId:  data.UnitColorId ? data.UnitColorId.ColorId : null,
          TitleLocationId: data.TitleLocationId ? data.TitleLocationId.ResultingTitleLocationId: null,
          TitleTypeId: data.TitleLocationId ? data.TitleLocationId.ResultingTitleTypeId : null,
          UnitTitleStateId: data.UnitTitleStateId ? data.UnitTitleStateId.StateId : null,
          PhysicalInventoryAddressId: data.PhysicalInventoryAddressId ? data.PhysicalInventoryAddressId.LocationId : null,
          LineOfCreditId: data.LineOfCreditId ? data.LineOfCreditId.LineOfCreditId : null,
          BuyerBankAccountId: data.BuyerBankAccountId ? data.BuyerBankAccountId.BankAccountId : null,
          SellerBusinessId: data.SellerBusinessId ? data.SellerBusinessId.BusinessId : null
        });

        return api.request('POST', '/floorplan/create', data);
      },
      filterValues: {
        ALL: 'pending,approved,completed,denied,paidNo,paidYes,titleNo,titleYes',
        // dealer filters (irrespective of paid or not, title or not)
        PENDING: 'pending,paidNo,paidYes,titleNo,titleYes',
        DENIED: 'denied,paidNo,paidYes,titleNo,titleYes',
        APPROVED: 'approved,paidNo,paidYes,titleNo,titleYes',
        COMPLETED: 'completed,paidNo,paidYes,titleNo,titleYes',
        // auction filters (differentiate by paid or not, and sometimes by title or not)
        PENDING_NOT_PAID: 'pending,paidNo,titleNo,titleYes',
        DENIED_NOT_PAID: 'denied,paidNo,titleNo,titleYes',
        APPROVED_PAID: 'approved,paidYes,titleNo,titleYes',
        APPROVED_NOT_PAID: 'approved,paidNo,titleNo,titleYes',
        COMPLETED_PAID: 'completed,paidYes,titleNo,titleYes',
        COMPLETED_NOT_PAID: 'completed,paidNo,titleNo,titleYes',
        NO_TITLE_PAID: 'pending,approved,completed,denied,titleNo,paidYes'
      },
      search: function (criteria, paginator) {
        var params = {
          Keyword: criteria.query,
          SearchPending: criteria.filter.indexOf('pending') >= 0,
          SearchApproved: criteria.filter.indexOf('approved') >= 0,
          SearchCompleted: criteria.filter.indexOf('completed') >= 0,
          SearchDenied: criteria.filter.indexOf('denied') >= 0,
          SearchPaid: criteria.filter.indexOf('paidYes') >= 0,
          SearchUnPaid: criteria.filter.indexOf('paidNo') >= 0,
          SearchHasTitle: criteria.filter.indexOf('titleYes') >= 0,
          SearchNoTitle: criteria.filter.indexOf('titleNo') >= 0,
          // default values for un-set dates may need adjusted during API integration
          StartDate: api.toShortISODate(criteria.startDate) || undefined,
          EndDate: api.toShortISODate(criteria.endDate) || undefined,
          OrderBy: 'FlooringDate',
          OrderDirection: 'DESC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };
        return api.request('GET', '/floorplan/search', params).then(
          function (results) {
            return Paginate.addPaginator(results, results.FloorplanRowCount, params.PageNumber, params.PageSize);
          }
        );
      }
    };
  });
