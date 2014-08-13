'use strict';

angular.module('nextgearWebApp')
  .factory('VehicleDetails', function(api) {

    return {
      getDetails: function(stockNumber) {
        return api.request('GET', '/floorplan/expandeddetail/' + stockNumber);
      },
      getPaymentDetails: function(stockNumber, id) {
        return api.request('GET', '/floorplan/mobiledetails/financialsummary/payment/' + stockNumber + '/' + id);
      },
      getFeeDetails: function(stockNumber, id) {
        return api.request('GET', '/floorplan/mobiledetails/financialsummary/fee/' + stockNumber + '/' + id);
      }
    };
  });
