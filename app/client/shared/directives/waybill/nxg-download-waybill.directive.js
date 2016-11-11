(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgDownloadWaybill', nxgDownloadWaybill);

  function nxgDownloadWaybill() {
    return {
      templateUrl: 'client/shared/directives/waybill/nxg-download-waybill.html',
      restrict: "E",
      scope: {
        wizardStatus: '='
      },
      replace: true,
      controller: 'NxgDownloadWaybillCtrl'
    };
  }
})();
