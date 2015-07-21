(function () {
  'use strict';

  angular.module('nextgearWebApp').config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  otherwiseRouteConfig.$inject = ['$injector'];

  function otherwiseRouteConfig($injector) {
    var User = $injector.get('User');
    return !User.isLoggedIn() ? '/login' : User.isDealer() ? '/home' : '/act/home';
  }

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(otherwiseRouteConfig);
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          pageId: 'Login',
          allowAnonymous: true,
          margin: 'true'
        }
      })
      .state('maintenance', {
        url: '/maintenance',
        templateUrl: 'views/maintenance.html',
        controller: 'MaintenanceCtrl',
        data: {
          pageId: 'Maintenance',
          allowAnonymous: true
        }
      })
      .state('loginRecover', {
        url: '/login/recover',
        templateUrl: 'views/login.recover.html',
        controller: 'LoginRecoverCtrl',
        data: {
          pageId: 'LoginRecover',
          allowAnonymous: true,
          noDirectAccess: true,
          margin: 'true'
        }
      })
      .state('loginUpdateSecurity', {
        url: '/login/updateSecurity',
        templateUrl: 'views/login.updateSecurity.html',
        controller: 'LoginUpdateSecurityCtrl',
        data: {
          pageId: 'LoginUpdateSecurity',
          noDirectAccess: true
        }
      })
      .state('loginCreatePassword', {
        url: '/login/createPassword',
        templateUrl: 'views/login.createPassword.html',
        controller: 'LoginCreatePasswordCtrl',
        data: {
          pageId: 'LoginCreatePassword',
          noDirectAccess: true
        }
      })
      .state('dashboard', {
        url: '/home',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        data: {
          pageId: 'Dashboard',
          showNavBar: true
        }
      })
      .state('payments', {
        url: '/payments?filter',
        templateUrl: 'views/payments.html',
        controller: 'PaymentsCtrl',
        data: {
          pageId: 'Payments',
          showNavBar: true
        }
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: 'views/checkout.html',
        controller: 'CheckoutCtrl',
        data: {
          pageId: 'Checkout',
          showNavBar: true
        }
      })
      .state('receipts', {
        url: '/receipts',
        templateUrl: 'views/receipts.html',
        controller: 'ReceiptsCtrl',
        data: {
          pageId: 'Receipts',
          showNavBar: true
        }
      })
      .state('floorplan', {
        url: '/floorplan?filter',
        templateUrl: 'views/floorplan.html',
        controller: 'FloorplanCtrl',
        data: {
          pageId: 'Floorplan',
          showNavBar: true
        }
      })
      .state('titlereleases', {
        url: '/titlereleases',
        templateUrl: 'views/titlereleases.html',
        controller: 'TitleReleasesCtrl',
        data: {
          pageId: 'TitleReleases',
          showNavBar: true
        }
      })
      .state('titleReleaseCheckout', {
        url: '/titlereleasecheckout',
        templateUrl: 'views/titlereleasecheckout.html',
        controller: 'TitleReleaseCheckoutCtrl',
        data: {
          pageId: 'TitleReleasesCheckout',
          showNavBar: true
        }
      })
      .state('vehicledetails', {
        url: '/vehicledetails?stockNumber',
        templateUrl: 'views/vehicledetails.html',
        controller: 'VehicleDetailsCtrl',
        data: {
          pageId: 'VehicleDetails',
          showNavBar: true
        }
      })
      .state('floorcar', {
        url: '/floorcar',
        templateUrl: 'views/floorcar.html',
        controller: 'FloorCarCtrl',
        data: {
          pageId: 'FloorCar',
          showNavBar: true
        }
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl',
        data: {
          pageId: 'Reports',
          showNavBar: true
        }
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsCtrl',
        data: {
          pageId: 'Analytics',
          showNavBar: true
        }
      })
      .state('documents', {
        url: '/documents',
        templateUrl: 'views/documents.html',
        controller: 'DocumentsCtrl',
        data: {
          pageId: 'Documents',
          showNavBar: true
        }
      })
      .state('profile_settings', {
        url: '/profile_settings',
        templateUrl: 'views/profileSettings.html',
        controller: 'ProfileSettingsCtrl',
        data: {
          pageId: 'ProfileSettings',
          showNavBar: true
        }
      })
      .state('account_management', {
        url: '/account_management',
        templateUrl: 'views/account_management.html',
        controller: 'AccountManagementCtrl',
        data: {
          pageId: 'AccountManagement',
          showNavBar: true
        }
      })
      .state('valueLookup', {
        url: '/valueLookup',
        templateUrl: 'views/valuelookup.html',
        controller: 'ValueLookupCtrl',
        data: {
          pageId: 'ValueLookup',
          showNavBar: true
        }
      })
      // AUCTION STATES
      .state('auction_dashboard', {
        url: '/act/home',
        templateUrl: 'views/auction.dashboard.html',
        controller: 'AuctionDashboardCtrl',
        data: {
          pageId: 'AuctionDashboard',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_dealersearch', {
        url: '/act/dealersearch',
        templateUrl: 'views/auction.dealersearch.html',
        controller: 'AuctionDealerSearchCtrl',
        data: {
          pageId: 'AuctionDealerSearch',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_bulkflooring', {
        url: '/act/bulkflooring',
        templateUrl: 'views/auction.bulkflooring.html',
        controller: 'FloorCarCtrl',
        data: {
          pageId: 'AuctionFloorCar',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_sellerfloorplan', {
        url: '/act/sellerfloorplan',
        templateUrl: 'views/auction.sellerfloorplan.html',
        controller: 'FloorplanCtrl',
        data: {
          pageId: 'AuctionFloorplan',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_reports', {
        url: '/act/reports',
        templateUrl: 'views/auction.reports.html',
        controller: 'AuctionReportsCtrl',
        data: {
          pageId: 'AuctionReports',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_documents', {
        url: '/act/documents',
        templateUrl: 'views/auction.documents.html',
        controller: 'AuctionDocumentsCtrl',
        data: {
          pageId: 'AuctionDocuments',
          isAuctionState: true,
          showNavBar: true
        }
      })
      .state('auction_settings', {
        url: '/act/settings',
        templateUrl: 'views/auction.settings.html',
        controller: 'AuctionSettingsCtrl',
        data: {
          pageId: 'AuctionSettings',
          isAuctionState: true,
          showNavBar: true
        }
      });
  }
})();
