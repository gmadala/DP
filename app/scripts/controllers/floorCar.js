'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, User) {

    // user model holds "dealer static" data needed to populate form dropdowns via user.getStatics()
    $scope.user = User;

    // TODO: Move this temporary code into business search directive as part of req #304
    $scope.openBusinessSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/businessSearch.html',
        controller: 'BusinessSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
