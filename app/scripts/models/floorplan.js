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
          UnitPurchaseDate: api.toShortISODate(data.UnitPurchaseDate),
          // option object values that need flattened to ids
          UnitColorId: data.UnitColorId.ColorId,
          TitleLocationId: data.TitleLocationId.ResultingTitleLocationId,
          TitleTypeId: data.TitleLocationId.ResultingTitleTypeId,
          UnitTitleStateId: data.UnitTitleStateId.StateId,
          PhysicalInventoryAddressId: data.PhysicalInventoryAddressId.LocationId,
          LineOfCreditId: data.LineOfCreditId.LineOfCreditId,
          BuyerBankAccountId: data.BuyerBankAccountId.BankAccountId
        });

        // seller info is disabled for trade-in sales
        if (data.SaleTradeIn) {
          data.SellerBusinessId = null;
        }

        return api.request('POST', '/floorplan/create', data);
      }
    };
  });
