'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionSellerFloorplanCtrl', function($scope, $dialog) {

    $scope.searchResults = [1, 2, 3];

    $scope.openEditTitle = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/editTitle.html',
        controller: 'EditTitleCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };

  });
