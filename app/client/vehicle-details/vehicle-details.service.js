(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('VehicleDetails', VehicleDetails);

  VehicleDetails.$inject = ['api'];

  function VehicleDetails(api) {

    return {
      getDetails: function(stockNumber) {
        return api.request('GET', '/floorplan/v1_1/expandeddetail/' + stockNumber)
          .then(function(data) {
            /**
             * VO-3015 (related to MOB-877) - The FloorplanTotal value coming from the service is the financed amount.
             * Per Blake Weishaar, this value should be the sum of the Total Paid and the Total Outstanding.
             */
            if (data && data.FinancialSummaryInfo) {
              var fs = data.FinancialSummaryInfo;
              fs.FloorplanTotal = fs.TotalPaid + fs.TotalOutstanding;
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

  }
})();
