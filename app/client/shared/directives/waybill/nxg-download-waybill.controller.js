(function() {
  'use strict';
  angular
    .module('nextgearWebApp')
    .controller('NxgDownloadWaybillCtrl', NxgDownloadWaybillCtrl);

  NxgDownloadWaybillCtrl.$inject = ['$scope', 'fedex', 'User'];

  function NxgDownloadWaybillCtrl($scope, fedex, User) {
    $scope.getWaybill = function() {
      var businessId = null;
      User.getInfo().then(function(info) {
        businessId = info.BusinessId;

        fedex.getWaybill(businessId)
          .then(function(data) {
            if (data.waybill !== null) {
              var blob = $scope.base64ToBlob(data.waybill, 'application/pdf');
              /*global saveAs */
              saveAs(blob, "FedEx-" + data.trackingNumber + ".pdf");
            }
          });
      });
    };

    $scope.base64ToBlob = function(b64Data, contentType, sliceSize, processByteArray) {
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
    };

  }

})
();

