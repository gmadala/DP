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
              var blob = fedex.base64ToBlob(data.waybill, 'application/pdf');
              /*global saveAs */
              saveAs(blob, "FedEx-" + data.trackingNumber + ".pdf");
            }
          });
      });
    };
  }
})
();

