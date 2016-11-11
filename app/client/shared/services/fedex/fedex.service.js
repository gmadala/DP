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
            return (User.getFeatures().hasOwnProperty('printFedExWaybillDealer') ? User.getFeatures().printFedExWaybillDealer.enabled : false);
          } else {
            return (User.getFeatures().hasOwnProperty('printFedExWaybillNonDealer') ? User.getFeatures().printFedExWaybillNonDealer.enabled : false);
          }
        }

        return false;
      },
      getWaybill: function (businessId, wizardStatus) {
        return api.request('GET', api.ngenContentLink('/fedex/waybill/' + businessId), null, null, true, handleNgenSucessRequest).then(function (response) {
          return {
            waybill: response.data.labelImage,
            trackingNumber: response.data.trackingNumber,
            wizardStatus: wizardStatus
          };
        });
      }
    };

    function handleNgenSucessRequest(response, wizardStatus) {
      api.resetSessionTimeout();

      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.FedExTrackingNumber = response.trackingNumber;
        result.fromWizard = wizardStatus === null ? false : wizardStatus;
        segmentio.track(metric.WAYBILL_PRINTED, result);
      });

      return response;
    }
  }
})();
