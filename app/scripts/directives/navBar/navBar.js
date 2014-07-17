'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };
  })

  .controller('NavBarCtrl', function($rootScope, $scope, $state, User, metric) {
    var dealerLinks = [
        { name: 'Home', href: '#/home', activeWhen: 'home', metric: metric.CLICK_HOME_LINK },
        { name: 'Floor a Car', href: '#/floorcar', activeWhen: 'floorcar', metric: metric.CLICK_FLOOR_A_CAR_LINK },
        { name: 'View a Report', href: '#/reports', activeWhen: 'reports', metric: metric.CLICK_VIEW_A_REPORT_LINK },
        { name: 'View Analytics', href: '#/analytics', activeWhen: 'analytics', metric: metric.CLICK_VIEW_ANALYTICS_LINK },
        { name: 'Resources', href: '#/documents', activeWhen: 'documents', metric: metric.CLICK_RESOURCES_LINK }
      ],
      auctionLinks = [
        { name: 'Home', href: '#/act/home', activeWhen: 'auction_home', metric: metric.CLICK_AUCTION_HOME_LINK },
        { name: 'View a Report', href: '#/act/reports', activeWhen: 'auction_reports', metric: metric.CLICK_AUCTION_REPORTS_LINK },
        { name: 'Resources', href: '#/act/documents', activeWhen: 'auction_documents', metric: metric.CLICK_AUCTION_RESOURCES_LINK }
      ];

    $scope.user = {
      isDealer: User.isDealer,
      info: User.getInfo,
      logout: function() {
        $rootScope.$emit('event:userRequestedLogout');
      },
      navLinks: function() {
        return User.isDealer() ? dealerLinks : auctionLinks;
      },
      homeLink: function(){
        return User.isDealer() ? '#/home' : '#/act/home';
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
