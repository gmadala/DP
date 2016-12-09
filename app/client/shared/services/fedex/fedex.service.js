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

        return api.request('GET', api.ngenContentLink('/fedex/waybill/' + businessId), null, null, true, handleNgenRequest).then(function (response) {

          kissMetricInfo.getKissMetricInfo().then(function (result) {
            result.fedexTrackingNumber = response.data.trackingNumber;
            result.fromWizard = wizardStatus === null || wizardStatus === undefined ? false : wizardStatus;
            segmentio.track(metric.WAYBILL_PRINTED, result);
          });

          return {
            waybill: response.data.labelImage,
            trackingNumber: response.data.trackingNumber,
            wizardStatus: wizardStatus
          };

        });
      },
      base64ToBlob: function(b64Data, contentType, sliceSize, processByteArray){
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        if (processByteArray !== undefined) {
          processByteArray(byteArrays);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
    };

    function handleNgenRequest(response) {
      api.resetSessionTimeout();
      return response;
    }
  }
})();
