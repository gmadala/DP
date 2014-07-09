'use strict';

angular.module('nextgearWebApp')
  .factory('VehicleDetails', function(api) {

    return {
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
