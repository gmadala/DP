'use strict';

angular.module('nextgearWebApp')
  .factory('Floorplan', function(api) {
    return {
      fetchStatusSummary: function() {
        return api.request('GET', '/dealer/summary').then(function(result) {
          return {
            approved: result.ApprovedFloorplans,
            pending: result.PendingFloorplans,
            denied: result.DeniedFloorplans  // availability pending Leaf API change ticket DTWO-1891
          };
        });
      },
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
      }
    };
  });
