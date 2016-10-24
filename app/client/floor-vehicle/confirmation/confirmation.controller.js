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
    'fedex',
    '$rootScope'
  ];

  function FlooringConfirmationCtrl($scope, User, kissMetricInfo, segmentio, metric, $stateParams, Upload, nxgConfig, $state, fedex, $rootScope) {
    var vm = this;

    // if (!$stateParams.stockNumber || !$stateParams.floorplanId) {
    //   $state.go('flooringWizard.car');
    // }

    vm.stockNumber = $stateParams.stockNumber;
    // vm.uploadSuccess = $stateParams.uploadSuccess;
    // vm.uploadRetrySuccess = null;
    // vm.files = $stateParams.files;


    vm.surveyComplete = false;
    vm.starValue = 0;
    vm.surveyComment = null;

    // vm.wayBillPrintingEnabled = fedex.wayBillPrintingEnabled();

    User.getInfo().then(function (userInfo) {
      vm.user = userInfo;
    });

    vm.submitSurvey = function () {
      console.log("submitting survey");
      console.log($scope.confirmationForm.$valid);
      if (!$scope.confirmationForm.$valid) {
        return;
      }
      console.log("checking to make sure");
      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.flooringExperience = vm.starValue;
        result.businessNumber = vm.user.BusinessNumber;
        result.businessId = vm.user.BusinessId;
        result.surveyComment = vm.surveyComment;

        segmentio.track(metric.FLOORING_EXPERIENCE_RATING, result);
      });

      vm.surveyComplete = true;
    };

    // vm.reupload = function () {
    //   Upload.upload({
    //     url: nxgConfig.apiBase + '/floorplan/upload/' + $stateParams.floorplanId,
    //     method: 'POST',
    //     data: {
    //       file: vm.files
    //     }
    //   }).then(function (response) {
    //     vm.uploadRetrySuccess = response.data.Success;
    //   });
    // };

  }

})();
