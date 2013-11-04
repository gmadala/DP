'use strict';

angular.module('nextgearWebApp')
  .factory('VehicleDetails', function($q, api) {

    return {
      getDetails: function(stockNum) {
        return api.request('GET', '/floorplan/' + stockNum).then(function(r) {
          return {
            vin: r.UnitVin,
            make: r.UnitMake,
            model: r.UnitModel,
            style: r.UnitStyle,
            color: r.UnitColor,
            year: r.UnitYear,
            currentMileage: r.UnitCurrentMileage,
            salvage: r.Salvage,
            status: r.FloorplanStatusName,
            stockNumber: r.StockNumber,
            purchaseDate: r.UnitPurchaseDate,
            dateSubmitted: r.FlooringDate,
            financedAmount: r.AmountFinanced,
            purchaseAmount: r.PurchaseAmount,
            lastPayment: r.LastPaymentDate,
            lineOfCredit: r.LineOfCredit,
            termPlanName: r.TermPlanName,
            productType: r.ProductType,
            seller: r.SellerName,
            titleLocation: r.TitleLocation,
            titleState: r.TitleState,
            trackingNumber: r.TrackingNumber,
            disbursementDate: r.DisbursementDate,
            curtailments: r.Curtailments
          };
        });
      }
    };
  });
