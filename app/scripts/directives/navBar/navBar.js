'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
      return {
          restrict: 'A',
          templateUrl: "scripts/directives/navBar/navBar.html",
          controller: 'NavBarCtrl'
      };
  })

  .controller('NavBarCtrl', function($scope, DealerInfo) {
      $scope.isDealer = true;
      $scope.showSettings = false;
      $scope.dealerInfo = DealerInfo;
      $scope.showNavbar = false;

      // fetch the dealer info every time there's a new session (user could have changed)
      $scope.$on("AuthenticationSuccess", function() {
          DealerInfo.refreshInfo().then(function(results) {
              $scope.dealerInfo = results;
          })
          $scope.showNavbar = true;
      });
  });