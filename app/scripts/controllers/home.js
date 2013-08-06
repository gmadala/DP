'use strict';

angular.module('nextgearWebApp')
  .controller('HomeCtrl', function($scope, $state, $stateParams) {
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;

    /*
      STOP: This should be only stuff that's needed across multiple sub-states of "Home".
      Everything that's specific to one sub-state should go in the appropriate sub-controller,
      e.g. DashboardCtrl, PaymentsCtrl, etc.
     */

  });
