(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('AuctionHomeCtrl', AuctionHomeCtrl);

  AuctionHomeCtrl.$inject = ['$scope', '$state'];

  function AuctionHomeCtrl($scope, $state) {
    $scope.$state = $state;

    /*
     STOP: This should be only stuff that's needed across multiple sub-states of the auction's "Home".
     Everything that's specific to one sub-state should go in the appropriate sub-controller.
     */
  }
})();
