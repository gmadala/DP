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
    '$state',
    'fedex'
  ];

  function FlooringConfirmationCtrl($scope, User, kissMetricInfo, segmentio, metric, $stateParams, $state, fedex) {
    var vm = this;

    if (!$stateParams.stockNumber || !$stateParams.floorplanId) {
      $state.go('flooringWizard.car');
    }

    vm.stockNumber = $stateParams.stockNumber;

    vm.surveyComplete = false;
    vm.starValue = 0;
    vm.surveyComment = null;

    User.getInfo().then(function (userInfo) {
      vm.user = userInfo;
      vm.businessId = userInfo.BusinessId;
    });

    $scope.businessId = vm.businessId;

    vm.submitSurvey = function () {

      if (!$scope.confirmationForm.$valid) {
        return;
      }

      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.flooringExperience = vm.starValue;
        result.businessNumber = vm.user.BusinessNumber;
        result.businessId = vm.user.BusinessId;
        result.surveyComment = vm.surveyComment;

        segmentio.track(metric.FLOORING_EXPERIENCE_RATING, result);
      });

      vm.surveyComplete = true;
    };

    vm.getWaybill = function() {
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
})();
