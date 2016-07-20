(function () {
  'use strict';
  angular
    .module('nextgearWebApp')
    .controller('NxgDownloadWaybillCtrl', NxgDownloadWaybillCtrl);

  NxgDownloadWaybillCtrl.$inject = ['$scope', 'fedex'];

  function NxgDownloadWaybillCtrl($scope, fedex) {
    $scope.getWaybill = function () {
      fedex.getWaybill()
        .then(function (data) {
          if (data.waybill !== null) {
            var blob = b64toBlob(data.waybill, 'application/pdf');
            saveAs(blob, "Waybill.pdf");
          }
        });
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
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

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

  }


})();

