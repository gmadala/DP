'use strict';

angular.module('nextgearWebApp')
  .factory('VehicleDetails', function($q, api) {

    return {
      getDetails: function(stockNum) {
        return api.request('GET', 'floorplan/' + stockNum).then(function(r) {
          return {
            vin: r.UnitVin,
            make: r.UnitMake,
            model: r.UnitModel,
            style: r.UnitStyle,
            color: r.Color,
            year: r.UnitYear,
            currentMileage: r.UnitMileageAtApproval,
            salvage: r.Salvage,
            status: r.FloorplanStatusName,
            stockNumber: r.StockNumber,
            purchaseDate: r.UnitPurchaseDate,
            dateSubmitted: r.FlooringDate,
            financedAmount: r.AmountFinanced,
            purchaseAmount: r.PurchaseAmount,
            lastPayment: null, // TODO: This has yet to be added to the contract
            lineOfCredit: null, // TODO: This has yet to be added to the contract
            termPlanName: null, // TODO: This has yet to be added to the contract
            productType: r.ProductType,
            seller: r.SellerName,
            titleLocation: r.TitleLocation,
            titleState: r.TitleState,
            trackingNumber: null, // TODO: This has yet to be added to the contract
            disbursementDate: r.DisbursementDate
          };
        });
      },
      getCurtailmentSchedule: function(/*stockNum*/) {
        // TODO: Yet to be defined in the service
        /*return api.request('GET', 'someServiceURL/' + stockNum).then(function(r) {
         return {

         };
         })*/
        return $q;
      }
    };
  });
