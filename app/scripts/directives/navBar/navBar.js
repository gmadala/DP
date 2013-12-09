'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };
  })

  .controller('NavBarCtrl', function($rootScope, $scope, $state, User) {
    var dealerLinks = [
        { name: 'Home', href: '#/home', activeWhen: 'home' },
        { name: 'Floor a Car', href: '#/floorcar', activeWhen: 'floorcar' },
        { name: 'View a Report', href: '#/reports', activeWhen: 'reports' },
        { name: 'View Analytics', href: '#/analytics', activeWhen: 'analytics' },
        { name: 'Resources', href: '#/documents', activeWhen: 'documents' }
      ],
      auctionLinks = [
        { name: 'Home', href: '#/act/home', activeWhen: 'auction_home' },
        { name: 'View a Report', href: '#/act/reports', activeWhen: 'auction_reports' },
        { name: 'Resources', href: '#/act/documents', activeWhen: 'auction_documents' }
      ];

    $scope.user = {
      isDealer: User.isDealer,
      info: User.getInfo,
      logout: function() {
        $state.transitionTo('login');
      },
      navLinks: function() {
        return User.isDealer() ? dealerLinks : auctionLinks;
      }
    };

    // If current state includes the activeWhen property for the given link,
    // this will return true and the active class will be applied to style the nav
    // link appropriately.
    $scope.isActive = function(activeWhen) {
      return $state.includes(activeWhen);
    };

    $scope.showSettings = false;
    $scope.navState = $state;
  });
