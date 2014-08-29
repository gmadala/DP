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
    var dealerLinks = {
      primary: [
        { name: 'Dashboard', href: '#/home', activeWhen: 'home.dashboard', metric: metric.CLICK_DASHBOARD_LINK },
        { name: 'Payments', href: '#/home/payments', activeWhen: 'home.payments', metric: metric.CLICK_PAYMENTS_LINK },
        { name: 'Scheduled Payments', href: '#/home/scheduledPayments', activeWhen: 'home.scheduledPayments', metric: metric.CLICK_SCHEDULED_PAYMENTS_LINK },
        { name: 'Floor Plan', href: '#/home/floorplan', activeWhen: 'home.floorplan', metric: metric.CLICK_FLOORPLAN_LINK },
        { name: 'Title Releases', href: '#/home/titlereleases', activeWhen: 'home.titlereleases', metric: metric.CLICK_TITLE_RELEASE_LINK },
        { name: 'Receipts', href: '#/home/receipts', activeWhen: 'home.receipts', metric: metric.CLICK_RECEIPTS_LINK },
        { name: 'Reports', href: '#/reports', activeWhen: 'reports', metric: metric.CLICK_VIEW_A_REPORT_LINK },
        { name: 'Analytics', href: '#/analytics', activeWhen: 'analytics', metric: metric.CLICK_VIEW_ANALYTICS_LINK }
      ],
      secondary: [
        { name: 'Floor a Vehicle', href: '#/floorcar', activeWhen: 'floorcar', metric: metric.CLICK_FLOOR_A_CAR_LINK },
        { name: 'Resources', href: '#/documents', activeWhen: 'documents', metric: metric.CLICK_RESOURCES_LINK }
      ]
    },
    auctionLinks = {
      primary: [
        { name: 'Dashboard', href: '#/act/home', activeWhen: 'auction_home.dashboard', metric: '' },
        { name: 'Dealer Search', href: '#/act/home/dealersearch', activeWhen: 'auction_home.dealersearch', metric: '' },
        { name: 'Floor a Vehicle', href: '#/act/home/bulkflooring', activeWhen: 'auction_home.bulkflooring', metric: '' },
        { name: 'Seller Floor Plan Search', href: '#/act/home/sellerfloorplan', activeWhen: 'auction_home.sellerfloorplan', metric: '' },
        { name: 'View a Report', href: '#/act/reports', activeWhen: 'auction_reports', metric: metric.CLICK_AUCTION_REPORTS_LINK },
        { name: 'Resources', href: '#/act/documents', activeWhen: 'auction_documents', metric: metric.CLICK_AUCTION_RESOURCES_LINK }
      ]
    };

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
