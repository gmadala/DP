(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('fedex', fedex);

  fedex.$inject = ['api', 'User', 'kissMetricInfo', 'metric', 'segmentio'];

  function fedex(api, User, kissMetricInfo, metric, segmentio) {
    return {
      wayBillPrintingEnabled: function () {
        if (User.isUnitedStates()) {
          if (User.isDealer()) {
            return (User.getFeatures().hasOwnProperty('printFedExWaybillDealer') ? User.getFeature().printFedExWaybillDealer.enabled : false);
          } else {
            return (User.getFeatures().hasOwnProperty('printFedExWaybillNonDealer') ? User.getFeature().printFedExWaybillNonDealer.enabled : false);
          }
        }
      },
      getWaybill: function (businessId) {
        return api.request('GET', api.ngenContentLink('/fedex/waybill'), {id: businessId}, null, true, handleNgenSucessRequest, handleNgenError).then(function (response) {
          return {
            waybill: response.waybill,
            trackingnumber: response.trackingNumber
          };
        });
      }
    };

    function handleNgenError() {
      api.resetSessionTimeout();
      return false;
    }

    function handleNgenSucessRequest(response) {
      api.resetSessionTimeout();

      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.FedExTrackingNumber = response.trackingNumber;
        segmentio.track(metric.WAYBILL_PRINTED, result);
      });

      return response;
    }
  }
})();
