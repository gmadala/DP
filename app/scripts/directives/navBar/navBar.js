'use strict';

angular.module('nextgearWebApp')
  .directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };
  })

  .controller('NavBarCtrl', function($rootScope, $scope, $state, User, metric, Payments, gettextCatalog) {
    var dealerLinks = {
      primary: [
        { name: gettextCatalog.getString('Dashboard'), href: '#', activeWhen: 'dashboard', metric: metric.CLICK_DASHBOARD_LINK },
        { name: gettextCatalog.getString('Payments'), href: '#/payments', activeWhen: 'payments', metric: metric.CLICK_PAYMENTS_LINK },
        { name: gettextCatalog.getString('Scheduled Payments'), href: '#/scheduledPayments', activeWhen: 'scheduledPayments', metric: metric.CLICK_SCHEDULED_PAYMENTS_LINK },
        { name: gettextCatalog.getString('Floor Plan'), href: '#/floorplan', activeWhen: 'floorplan', metric: metric.CLICK_FLOORPLAN_LINK },
        { name: gettextCatalog.getString('Receipts'), href: '#/receipts', activeWhen: 'receipts', metric: metric.CLICK_RECEIPTS_LINK },
        { name: gettextCatalog.getString('Reports'), href: '#/reports', activeWhen: 'reports', metric: metric.CLICK_VIEW_A_REPORT_LINK },
        { name: gettextCatalog.getString('Analytics'), href: '#/analytics', activeWhen: 'analytics', metric: metric.CLICK_VIEW_ANALYTICS_LINK }
      ],
      secondary: [
        { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/floorcar', activeWhen: 'floorcar', metric: metric.CLICK_FLOOR_A_CAR_LINK },
        { name: gettextCatalog.getString('Resources'), href: '#/documents', activeWhen: 'documents', metric: metric.CLICK_RESOURCES_LINK }
      ]
    },
    auctionLinks = {
      primary: [
        { name: gettextCatalog.getString('Dashboard'), href: '#/act/home', activeWhen: 'auction_dashboard', metric: '' },
        { name: gettextCatalog.getString('Dealer Search'), href: '#/act/dealersearch', activeWhen: 'auction_dealersearch', metric: '' },
        { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/act/bulkflooring', activeWhen: 'auction_bulkflooring', metric: '' },
        { name: gettextCatalog.getString('Seller Floor Plan Search'), href: '#/act/sellerfloorplan', activeWhen: 'auction_sellerfloorplan', metric: '' },
        { name: gettextCatalog.getString('View a Report'), href: '#/act/reports', activeWhen: 'auction_reports', metric: metric.CLICK_AUCTION_REPORTS_LINK },
        { name: gettextCatalog.getString('Resources'), href: '#/act/documents', activeWhen: 'auction_documents', metric: metric.CLICK_AUCTION_RESOURCES_LINK }
      ]
    };

    // Only show Title Release link if API says we should for this user
    if(User.isLoggedIn()) {
      User.infoPromise().then(function(info) {
        if(info.DisplayTitleReleaseProgram) {
          dealerLinks.primary.splice(4, 0, {
            name: gettextCatalog.getString('Title Releases'),
            href: '#/titlereleases',
            activeWhen: 'titlereleases',
            metric: metric.CLICK_TITLE_RELEASE_LINK
          });
        }
      });
    }

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

    $scope.isCollapsed = true;
    $scope.navState = $state;
  });
