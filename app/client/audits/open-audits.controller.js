(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('AuditsCtrl', AuditsCtrl);

  AuditsCtrl.$inject = [
    '$scope',
    '$state',
    'User',
    'Audits'
  ];

  function AuditsCtrl($scope,
                      $state,
                      User,
                      Audits) {

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
