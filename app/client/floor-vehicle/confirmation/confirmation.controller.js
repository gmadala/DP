(function() {
  'use strict';

  angular
    .module( 'nextgearWebApp' )
    .controller( 'FlooringConfirmationCtrl', FlooringConfirmationCtrl );

  FlooringConfirmationCtrl.$inject = [
    '$scope',
    'User',
    'kissMetricInfo',
    'segmentio',
    'metric',
    '$stateParams',
    'Upload',
    'nxgConfig',
    '$state',
    'fedex'
  ];

  function FlooringConfirmationCtrl($scope, User, kissMetricInfo, segmentio, metric, $stateParams, Upload, nxgConfig, $state, fedex) {
    var vm = this;

    if (!$stateParams.stockNumber || !$stateParams.floorplanId) {
      $state.go('flooringWizard.car');
    }

    vm.stockNumber = $stateParams.stockNumber;
    vm.uploadSuccess = $stateParams.uploadSuccess;
    vm.uploadRetrySuccess = null;
    vm.files = $stateParams.files;

    vm.hideStars = false;
    vm.starHoverValue = 0;

    vm.wayBillPrintingEnabled = fedex.wayBillPrintingEnabled();

    User.getInfo().then(function (userInfo) {
      vm.user = userInfo;
    });

    vm.starHover = function (starValue) {
      vm.starHoverValue = starValue;
    };

    vm.starClick = function (starValue) {
      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.flooringExperience = starValue;
        result.businessNumber = vm.user.BusinessNumber;
        result.businessId = vm.user.BusinessId;

        segmentio.track(metric.FLOORING_EXPERIENCE_RATING, result);

        vm.hideStars = true;
      });
    };

    vm.reupload = function () {
      Upload.upload({
        url: nxgConfig.apiBase + '/floorplan/upload/' + $stateParams.floorplanId,
        method: 'POST',
        data: {
          file: vm.files
        }
      }).then(function (response) {
        vm.uploadRetrySuccess = response.data.Success;
      });
    };

  }

})();
