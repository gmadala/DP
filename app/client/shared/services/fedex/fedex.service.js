(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('fedex', fedex);

  fedex.$inject = ['api', 'User', 'kissMetricInfo'];

  function fedex(api, User, kissMetricInfo) {
    return {
      wayBillPrintingEnabled : function () {
        return true;
        // if(User.isUnitedStates()) {
        //   if (User.isDealer()) {
        //     return (User.getFeatures().hasOwnProperty('printFedExWaybillDealer') ? User.getFeature().printFedExWaybillDealer.enabled : false);
        //   } else {
        //     return (User.getFeatures().hasOwnProperty('printFedExWaybillNonDealer') ? User.getFeature().printFedExWaybillNonDealer.enabled : false);
        //   }
        // }
      },
      getWaybill: function (businessId) {
        return api.request('GET', api.ngenContentLink('/fedex/waybill'), {id: businessId}, null, true, handleNgenSucessRequest, handleNgenError).then(function (response) {
          return {
            waybill: response.waybill,
            trackingnumber: response.trackingNumber
          }
        });
      }
    };

    function handleNgenError() {
      //Add Kiss Metric - Error
    }

    function handleNgenSucessRequest(response) {
      api.resetSessionTimeout();
      //Add Kiss Metric - Success
      return response;
    }
  }
})();
