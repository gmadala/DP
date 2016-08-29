(function () {
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
    'kissMetricInfo',
    '$location',
    '$timeout',
    'localStorageService',
    'fedex',
    'nxgConfig'
  ];

  function NavBarCtrl($rootScope,
    $scope,
    $state,
    User,
    Payments,
    gettextCatalog,
    language,
    kissMetricInfo,
    $location,
    $timeout,
    localStorageService,
    fedex,
    nxgConfig) {

    $scope.isCollapsed = true;
    var paymentsSubMenu = [
      { name: gettextCatalog.getString('Make a Payment'), href: '#/payments', activeWhen: 'payments', subMenu: paymentsSubMenu },
      { name: gettextCatalog.getString('Receipts'), href: '#/receipts', activeWhen: 'receipts' },
    ],
      floorplansSubMenu = [
        { name: gettextCatalog.getString('View Floor Plan'), href: '#/floorplan', activeWhen: 'floorplan', subMenu: floorplansSubMenu },
        { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/floorcar', activeWhen: 'floorcar' },
      ],
      resourcesSubMenu = [
        { name: gettextCatalog.getString('Resources'), href: '#/documents', activeWhen: 'documents' },
        { name: gettextCatalog.getString('Reports'), href: '#/reports', activeWhen: 'reports' },
        { name: gettextCatalog.getString('Analytics'), href: '#/analytics', activeWhen: 'analytics' },
      ];
    var dealerLinks = {
      primary: [
        { name: gettextCatalog.getString('Dashboard'), href: '#/home', activeWhen: 'dashboard' },
        { name: gettextCatalog.getString('Payments'), href: '#/payments', activeWhen: 'payments', subMenu: paymentsSubMenu },
        { name: gettextCatalog.getString('Floor Plan'), href: '#/floorplan', activeWhen: 'floorplan', subMenu: floorplansSubMenu },
        { name: gettextCatalog.getString('Resources'), href: '#/documents', activeWhen: 'documents', subMenu: resourcesSubMenu }
      ]
    },
      auctionLinks = {
        primary: [
          { name: gettextCatalog.getString('Dashboard'), href: '#/act/home', activeWhen: 'auction_dashboard' },
          { name: gettextCatalog.getString('Dealer Search'), href: '#/act/dealersearch', activeWhen: 'auction_dealersearch' },
          { name: gettextCatalog.getString('Floor a Vehicle'), href: '#/act/bulkflooring', activeWhen: 'auction_bulkflooring' },
          { name: gettextCatalog.getString('Floor Plan Search'), href: '#/act/sellerfloorplan', activeWhen: 'auction_sellerfloorplan' },
          { name: gettextCatalog.getString('Reports'), href: '#/act/reports', activeWhen: 'auction_reports' },
          { name: gettextCatalog.getString('Resources'), href: '#/act/documents', activeWhen: 'auction_documents' }
        ]
      };

    $scope.initNav = function () {
      kissMetricInfo.getKissMetricInfo().then(function (result) {
        $scope.kissMetricData = result;
      });

      return User.getInfo().then(function (info) {
        $scope.isUnitedStates = User.isUnitedStates();
        $scope.displayTitleRelease = info.DisplayTitleReleaseProgram;
        $scope.eventSalesEnabled = User.getFeatures().hasOwnProperty('eventSales') ? User.getFeatures().eventSales.enabled : true;
        $scope.fedExWaybillEnabled = fedex.wayBillPrintingEnabled();
        if ($scope.isUnitedStates) {
          floorplansSubMenu.splice(2, 0, {
            name: gettextCatalog.getString('Value Lookup'),
            href: '#/valueLookup',
            activeWhen: 'valueLookup'
          });
          if ($scope.eventSalesEnabled) {
            resourcesSubMenu.push({
              name: gettextCatalog.getString('Promos'),
              href: '#/promos',
              activeWhen: 'promos'
            });
          }
        }
        if ($scope.displayTitleRelease) {
          floorplansSubMenu.push({
            name: gettextCatalog.getString('Title Releases'),
            href: '#/titlereleases',
            activeWhen: 'titlereleases'
          });
        }
        if (User.getFeatures().hasOwnProperty('responsiveFloorplanBuyer') && User.getFeatures().responsiveFloorplanBuyer.enabled === true) {
          floorplansSubMenu[1].href = '#/flooring-wizard';
          floorplansSubMenu[1].activeWhen = 'flooring-wizard';
        }

        $scope.user = {
          BusinessNumber: info.BusinessNumber,
          BusinessName: info.BusinessName,
          isDealer: User.isDealer,
          logout: function () {
            if ($scope.isMobile) {
              // wait until animation completes before emitting logout, otherwise modal sometimes sizes incorrectly on slow phones
              setTimeout(function () {
                $rootScope.$emit('event:userRequestedLogout');
              }, 510);
            } else {
              $rootScope.$emit('event:userRequestedLogout');
            }
          },
          navLinks: function () {
            return User.isDealer() ? dealerLinks : auctionLinks;
          },
          homeLink: function () {
            return User.isDealer() ? '#/home' : '#/act/home';
          }
        };

        $scope.support = {
          email: User.isDealer() ? info.MarketEMail : 'auctionservices@nextgearcapital.com',
          phone: info.MarketPhoneNumber,
          customerSupportPhone: info.CSCPhoneNumber
        };
        var config = nxgConfig.userVoice;
        // check user type, dealers and auctions will have different subdomains to go to
        $scope.forumId = config.dealerForumId;
        $scope.customTemplateId = config.dealerCustomTemplateId;
      });
    };

    if (!User.isLoggedIn()) {
      // catching auth event to trigger nav init
      $scope.$on('event:userAuthenticated', function () {
        $scope.initNav();
      });

      if ($scope.displayTitleRelease) {
        dealerLinks.primary.splice(3, 1);
      }
    } else {
      // catching user already logged in to trigger nav init
      $scope.initNav();
    }

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

      angular.forEach(queue.fees, function () {
        count++;
      });

      angular.forEach(queue.payments, function () {
        count++;
      });

      return count;
    };

    $scope.onCartClicked = function () {
      $state.transitionTo('checkout');
    };

    // If current state includes the activeWhen property for the given link,
    // this will return true and the active class will be applied to style the nav
    // link appropriately.
    $scope.isActive = function (activeWhen) {
      return $state.includes(activeWhen);
    };

    $scope.isActiveGroup = function (subMenu) {
      for (var link in subMenu) {
        if ($state.includes(subMenu[link].activeWhen)) {
          return true;
        }
      }
      return false;
    };

    $scope.gotoPageIf = function (page) {
      var desktop = document.getElementsByClassName('no-touch');
      if (desktop.length > 0) {
        $location.path(page.substring(1));
        //remove open class
        $timeout(function () {
          document.getElementsByClassName('dropdown open')[0].classList.remove('open');
        }, 0);
      }
    };
    $scope.pageTitle = "";
    $scope.setPageTitle = function (page) {
      $scope.pageTitle = page;
    };

    $scope.getPageTitle = function () {
      if ($scope.pageTitle === "") {
        //$scope.setPageTitle($state.current.name);//Need to set the page title on inital load or refresh use arrays above
      }
      return $scope.pageTitle;
    };

    $scope.isDashboard = function () {
      return $state.current.name === "dashboard" || $state.current.name === "auction_dashboard" || $scope.pageTitle === "";
    };

    $scope.toggleMenu = function () {
      $state.current.data.showMenu = !$state.current.data.showMenu;
      $state.current.data.menuToggled = true;
      $scope.closeMenuTip();
    };

    $scope.closeMenu = function () {
      if ($state.current.data.showMenu) {
        $state.current.data.showMenu = false;
      }
    };

    $scope.addHover = function () {
      this.link.hasHover = true;
    };

    $scope.removeHover = function () {
      this.link.hasHover = false;
    };

    $rootScope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = true;
    });

    $scope.showSupport = false;
    $scope.closeSupport = function () {
      if ($scope.showSupport) {
        $scope.showSupport = false;
      }
    };

    $scope.toggleSupport = function () {
      $scope.showSupport = !$scope.showSupport;
    };

    $scope.navState = $state;
    $scope.hideMenuTip = localStorageService.get('hideMenuTip') || false;
    $scope.isMobile = window.innerWidth < 768;
    $scope.templateUrl = "/app/client/shared/directives/navbar/menuTip.html";
    $scope.closeMenuTip = function () {
      if (!$scope.hideMenuTip) {
        localStorageService.set('hideMenuTip', true);
        $scope.hideMenuTip = true;
      }
    };
  }
})();
