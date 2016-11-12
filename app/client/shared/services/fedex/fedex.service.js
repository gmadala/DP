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
      getWaybill: function (businessId) {
        return api.request('GET', api.ngenContentLink('/fedex/waybill/' + businessId), null, null, true, handleNgenSucessRequest).then(function (response) {
          return {
            waybill: response.data.labelImage,
            trackingNumber: response.data.trackingNumber
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
