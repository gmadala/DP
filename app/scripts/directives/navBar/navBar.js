'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };
  })

  .controller('NavBarCtrl', function($scope, $state, $location, User) {
    var dealerLinks = [
        { name: 'Home', href: '#/home' },
        { name: 'Floor a Car', href: '#/floorcar' },
        { name: 'View a Report', href: '#/reports' },
        { name: 'View Analytics', href: '#/analytics' },
        { name: 'Resources', href: '#/documents' }
      ],
      auctionLinks = [
        { name: 'Home', href: '#/act/home' },
        { name: 'View a Report', href: '#/act/reports' },
        { name: 'Resources', href: '#/act/documents' }
      ];

    $scope.user = {
      isDealer: User.isDealer,
      info: User.getInfo,
      logout: function() {
        $state.transitionTo('logout');
      },
      navLinks: function() {
        return User.isDealer() ? dealerLinks : auctionLinks;
      }
    };
    $scope.showSettings = false;
    $scope.navState = $state;
  });
