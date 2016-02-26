(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('NavBarCtrl', NavBarCtrl);

  NavBarCtrl.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    'User',
    'Payments',
    'gettextCatalog',
    'language',
    'kissMetricInfo'
  ];

  function NavBarCtrl(
    $rootScope,
    $scope,
    $state,
    User,
    Payments,
    gettextCatalog,
    language,
    kissMetricInfo) {

      $scope.isCollapsed = true;

      var dealerLinks = {
          primary: [
            { name: gettextCatalog.getString('Dashboard'), href: '#/home', activeWhen: 'dashboard'},
            { name: gettextCatalog.getString('Payments'), href: '#/payments', activeWhen: 'payments'},
            { name: gettextCatalog.getString('Floor Plan'), href: '#/floorplan', activeWhen: 'floorplan'},
            { name: gettextCatalog.getString('Receipts'), href: '#/receipts', activeWhen: 'receipts'},
            { name: gettextCatalog.getString('Reports'), href: '#/reports', activeWhen: 'reports'},
            { name: gettextCatalog.getString('Analytics'), href: '#/analytics', activeWhen: 'analytics'}
          ],
          secondary: [
            { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/floorcar', activeWhen: 'floorcar'},
            { name: gettextCatalog.getString('Resources'), href: '#/documents', activeWhen: 'documents'}

          ]
        },
        auctionLinks = {
          primary: [
            { name: gettextCatalog.getString('Dashboard'), href: '#/act/home', activeWhen: 'auction_dashboard'},
            { name: gettextCatalog.getString('Dealer Search'), href: '#/act/dealersearch', activeWhen: 'auction_dealersearch'},
            { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/act/bulkflooring', activeWhen: 'auction_bulkflooring'},
            { name: gettextCatalog.getString('Seller Floor Plan Search'), href: '#/act/sellerfloorplan', activeWhen: 'auction_sellerfloorplan'},
            { name: gettextCatalog.getString('View a Report'), href: '#/act/reports', activeWhen: 'auction_reports'},
            { name: gettextCatalog.getString('Resources'), href: '#/act/documents', activeWhen: 'auction_documents'}
          ]
        };

      $scope.$watch(function() { return User.isLoggedIn(); }, function(isLoggedIn) {
        if (isLoggedIn) {

          kissMetricInfo.getKissMetricInfo().then(function(result){
            $scope.kissMetricData = result;
          });

          User.getInfo().then(function (info) {
            $scope.isUnitedStates = User.isUnitedStates();
            $scope.displayTitleRelease = info.DisplayTitleReleaseProgram;
            $scope.eventSalesEnabled = User.getFeatures().hasOwnProperty('eventSales') ? User.getFeatures().eventSales.enabled : false;
            if ($scope.isUnitedStates) {
              dealerLinks.secondary.splice(1, 0, {
                name: gettextCatalog.getString('Value Lookup'),
                href: '#/valueLookup',
                activeWhen: 'valueLookup',
              });
              if($scope.eventSalesEnabled){
                dealerLinks.primary.push({
                  name: gettextCatalog.getString('Promos'),
                  href: '#/promos',
                  activeWhen: 'promos'
                });
              }
            }
            if ($scope.displayTitleRelease) {
              dealerLinks.primary.splice(3, 0, {
                name: gettextCatalog.getString('Title Releases'),
                href: '#/titlereleases',
                activeWhen: 'titlereleases'
              });
            }
            $scope.user = {
              BusinessNumber: info.BusinessNumber,
              BusinessName: info.BusinessName,
              isDealer: User.isDealer,
              logout: function () {
                $rootScope.$emit('event:userRequestedLogout');
              },
              navLinks: function () {
                return User.isDealer() ? dealerLinks : auctionLinks;
              },
              homeLink: function () {
                return User.isDealer() ? '#/home' : '#/act/home';
              }
            };
          });
        } else {
          if ($scope.displayTitleRelease) {
            dealerLinks.primary.splice(3, 1);
          }
          if ($scope.isUnitedStates) {
            dealerLinks.secondary.splice(1, 1);
          }
        }
      });

      // Enable chat only when we are using English
      $scope.$watch(function () {
        return gettextCatalog.currentLanguage;
      }, function (lang) {
        $scope.chatEnabled = lang === 'en';
      });

      $scope.isCurrentLanguage = function (lang) {
        return gettextCatalog.currentLanguage === lang;
      };

      $scope.updateLanguage = function (lang) {

        language.setCurrentLanguage(lang);

        // Force Refresh
        //   We are forced to refresh due to some two-way binding bugs
        window.location.reload();
      };

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

  }
})();
