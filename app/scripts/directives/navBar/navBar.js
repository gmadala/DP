'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };
  })

  .controller('NavBarCtrl', function($rootScope, $scope, $state, User, metric, Payments) {
    var dealerLinks = {
      primary: [
        { name: 'Dashboard', href: '#', activeWhen: 'dashboard', metric: metric.CLICK_DASHBOARD_LINK },
        { name: 'Payments', href: '#/payments', activeWhen: 'payments', metric: metric.CLICK_PAYMENTS_LINK },
        { name: 'Scheduled Payments', href: '#/scheduledPayments', activeWhen: 'scheduledPayments', metric: metric.CLICK_SCHEDULED_PAYMENTS_LINK },
        { name: 'Floor Plan', href: '#/floorplan', activeWhen: 'floorplan', metric: metric.CLICK_FLOORPLAN_LINK },
        { name: 'Receipts', href: '#/receipts', activeWhen: 'receipts', metric: metric.CLICK_RECEIPTS_LINK },
        { name: 'Reports', href: '#/reports', activeWhen: 'reports', metric: metric.CLICK_VIEW_A_REPORT_LINK },
        { name: 'Analytics', href: '#/analytics', activeWhen: 'analytics', metric: metric.CLICK_VIEW_ANALYTICS_LINK }
      ],
      secondary: [
        { name: 'Floor a Vehicle', href: '#/floorcar', activeWhen: 'floorcar', metric: metric.CLICK_FLOOR_A_CAR_LINK },
        { name: 'Value Lookup', href: '#/valueLookup', activeWhen: 'valueLookup', metric: '' },
        { name: 'Resources', href: '#/documents', activeWhen: 'documents', metric: metric.CLICK_RESOURCES_LINK }
      ]
    },
    auctionLinks = {
      primary: [
        { name: 'Dashboard', href: '#/act/home', activeWhen: 'auction_dashboard', metric: '' },
        { name: 'Dealer Search', href: '#/act/dealersearch', activeWhen: 'auction_dealersearch', metric: '' },
        { name: 'Floor a Vehicle', href: '#/act/bulkflooring', activeWhen: 'auction_bulkflooring', metric: '' },
        { name: 'Seller Floor Plan Search', href: '#/act/sellerfloorplan', activeWhen: 'auction_sellerfloorplan', metric: '' },
        { name: 'View a Report', href: '#/act/reports', activeWhen: 'auction_reports', metric: metric.CLICK_AUCTION_REPORTS_LINK },
        { name: 'Resources', href: '#/act/documents', activeWhen: 'auction_documents', metric: metric.CLICK_AUCTION_RESOURCES_LINK }
      ]
    };

    // Only show Title Release link if API says we should for this user
    // WARNING
    // This will break if, at any time in the future, we don't refresh when logging a user out.
    // If you log out without a refresh and log back in, it'll put a duplicate item into the nav.
    $scope.$watch(function() { return User.isLoggedIn(); }, function(isLoggedIn) {
      if(isLoggedIn) {
        User.infoPromise().then(function(info) {
          if(info.DisplayTitleReleaseProgram) {
            dealerLinks.primary.splice(4, 0, {
              name: 'Title Releases',
              href: '#/titlereleases',
              activeWhen: 'titlereleases',
              metric: metric.CLICK_TITLE_RELEASE_LINK
            });
          }
        });
      }
    });

    $scope.getQueueCount = function () {
      var queue = Payments.getPaymentQueue(),
          count = 0;

      angular.forEach(queue.fees, function() {
        count++;
      });

      angular.forEach(queue.payments, function() {
        count++;
      });

      return count;
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

    $scope.onCartClicked = function() {
      $state.transitionTo('checkout');
    };

    // If current state includes the activeWhen property for the given link,
    // this will return true and the active class will be applied to style the nav
    // link appropriately.
    $scope.isActive = function(activeWhen) {
      return $state.includes(activeWhen);
    };

    $rootScope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = true;
    });

    $scope.navState = $state;
  });
