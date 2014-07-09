'use strict';

angular.module('nextgearWebApp')
  .factory('VehicleDetails', function(api) {

    return {
      // getDetails: function(stockNum) {
      //   return api.request('GET', '/floorplan/' + stockNum).then(function(r) {
      //     return {
      //       vin: r.UnitVin,
      //       make: r.UnitMake,
      //       model: r.UnitModel,
      //       style: r.UnitStyle,
      //       color: r.UnitColor,
      //       year: r.UnitYear,
      //       currentMileage: r.UnitCurrentMileage,
      //       salvage: r.Salvage,
      //       status: r.FloorplanStatusName,
      //       stockNumber: r.StockNumber,
      //       purchaseDate: r.UnitPurchaseDate,
      //       dateSubmitted: r.FlooringDate,
      //       financedAmount: r.AmountFinanced,
      //       purchaseAmount: r.PurchaseAmount,
      //       lastPayment: r.LastPaymentDate,
      //       lineOfCredit: r.LineOfCredit,
      //       termPlanName: r.TermPlanName,
      //       productType: r.ProductType,
      //       seller: r.SellerName,
      //       sellerAddressLine1: r.SellerAddressLine1,
      //       sellerAddressLine2: r.SellerAddressLine2,
      //       sellerAddressCity: r.SellerAddressCity,
      //       sellerAddressState: r.SellerAddressState,
      //       sellerAddressZip: r.SellerAddressZip,
      //       titleLocation: r.TitleLocation,
      //       titleState: r.TitleState,
      //       trackingNumber: r.TrackingNumber,
      //       disbursementDate: r.DisbursementDate,
      //       interestAccrued: r.InterestAccrued,
      //       interestApplied: r.InterestApplied,
      //       feesAccrued: r.FeesAccrued,
      //       feesApplied: r.FeesApplied,
      //       inventoryLocation: r.InventoryLocationDescription
      //     };
      //   });
      // }

      getLanding: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/landing/' + stockNumber);
      },
      getVehicleInfo: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/vehicleinfo/' + stockNumber);
      },
      getTitleInfo: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/titleinfo/' + stockNumber);
      },
      getFlooringInfo: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/flooringinfo/' + stockNumber);
      },
      getValueInfo: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/valueinfo/' + stockNumber);
      },
      getFinancialSummary: function(stockNumber) {
        return api.request('GET', '/floorplan/mobiledetails/financialsummary/' + stockNumber).then(function(data) {
          /**
           * See MOB-877 - The FloorplanTotal value coming from the service is the financed amount. Per Blake Weishaar,
           * this value is meant to be the sum of the Total Paid and the Total Outstanding.
           */
          if (data) {
            data.FloorplanTotal = data.TotalOutstanding + data.TotalPaid;
          }
          return data;
        });
      },
      getPaymentDetails: function(stockNumber, id) {
        return api.request('GET', '/floorplan/mobiledetails/financialsummary/payment/' + stockNumber + '/' + id);
      },
      getFeeDetails: function(stockNumber, id) {
        return api.request('GET', '/floorplan/mobiledetails/financialsummary/fee/' + stockNumber + '/' + id);
      }

    };
  });
