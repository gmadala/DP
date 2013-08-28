'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog) {
    $scope.foo = '';
    $scope.openNumSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/NumSearchCtrl.html',
        controller: 'NumSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
    $scope.openNameSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/NameSearchCtrl.html',
        controller: 'NameSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
