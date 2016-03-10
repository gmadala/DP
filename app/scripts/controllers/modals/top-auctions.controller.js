(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('TopAuctionsCtrl', TopAuctionsCtrl);

  TopAuctionsCtrl.$inject = ['$scope', '$uibModalInstance', 'auctions'];

  function TopAuctionsCtrl($scope, $uibModalInstance, auctions) {

    var uibModalInstance = $uibModalInstance;
    $scope.data = auctions;

    // Allow the dialog to close itself using the "Close" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      uibModalInstance.close();
    };

  }
})();
