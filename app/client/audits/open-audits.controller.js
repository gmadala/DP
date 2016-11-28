(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('AuditsCtrl', AuditsCtrl);

  AuditsCtrl.$inject = [
    '$scope',
    '$state',
    'User',
    'Audits',
    'metric',
    'kissMetricInfo',
    'segmentio'
  ];

  function AuditsCtrl($scope,
                      $state,
                      User,
                      Audits,
                      metric,
                      kissMetricInfo,
                      segmentio) {

    kissMetricInfo.getKissMetricInfo().then(
      function(result){
        segmentio.track(metric.VIEW_OPEN_AUDITS, result);
      }
    );

    $scope.auditsEnabled = (User.getFeatures().hasOwnProperty('openAudits') ? User.getFeatures().openAudits.enabled : true);
    if (!$scope.auditsEnabled) {
      // This page is not enabled for this user
      $state.transitionTo('dashboard');
    }

    // Handles loading open audits
    $scope.audits = Audits;
    $scope.audits.refreshAudits();
  }
})();
