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

  function FlooringConfirmationCtrl($scope, User, kissMetricInfo, segmentio, metric, $stateParams, $state) {
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
  }
})();
