(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider'];

  otherwiseRouteConfig.$inject = ['$injector'];

  function otherwiseRouteConfig($injector) {
    var User = $injector.get('User');
    console.log('loggedIn in otherwise', User.isLoggedIn())
    return !User.isLoggedIn() ? '/login' : User.isDealer() ? '/home' : '/act/home';
  }

  function routeConfig($stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    $uiViewScrollProvider.useAnchorScroll();
    $urlRouterProvider.otherwise(otherwiseRouteConfig);
    $stateProvider
      .state('flooringWizard', {
        abstract: true,
        url: '/flooring-wizard',
        controller: 'WizardFloorCtrl',
        controllerAs: 'wizardFloor',
        templateUrl: 'client/floor-vehicle/wizard/wizard-floor.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringWizard.car', {
        url: '',
        controller: 'CarInfoCtrl',
        controllerAs: 'carInfo',
        templateUrl: 'client/floor-vehicle/wizard/car-info.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringWizard.sales', {
        url: '/sales',
        controller: 'SalesInfoCtrl',
        controllerAs: 'salesInfo',
        templateUrl: 'client/floor-vehicle/wizard/sales-info.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringWizard.payment', {
        url: '/payment',
        controller: 'PaymentInfoCtrl',
        controllerAs: 'paymentInfo',
        templateUrl: 'client/floor-vehicle/wizard/payment-info.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringWizard.document', {
        url: '/document',
        controller: 'DocumentInfoCtrl',
        controllerAs: 'documentInfo',
        templateUrl: 'client/floor-vehicle/wizard/document-info.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringWizard.reviewRequest', {
        url: '/reviewRequest',
        controller: 'ReviewRequestCtrl',
        controllerAs: 'reviewRequest',
        templateUrl: 'client/floor-vehicle/wizard/review-request.template.html',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('flooringConfirmation', {
        url: '/flooring-wizard/confirmation',
        controller: 'FlooringConfirmationCtrl',
        controllerAs: 'flooringConfirmation',
        templateUrl: 'client/floor-vehicle/confirmation/confirmation.template.html',
        params: {
          floorplanId: null,
          stockNumber: null
        },
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          isFeature: 'responsiveFloorplanBuyer',
          title: 'Floor a Vehicle'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'client/login/login.template.html',
        controller: 'LoginCtrl',
        data: {
          pageId: 'Login',
          allowAnonymous: true,
          margin: 'true'
        }
      })
      .state('maintenance', {
        url: '/maintenance',
        templateUrl: 'client/maintenance/maintenance.template.html',
        controller: 'MaintenanceCtrl',
        data: {
          pageId: 'Maintenance',
          allowAnonymous: true
        }
      })
      .state('loginRecover', {
        url: '/login/recover',
        templateUrl: 'client/login/login-recover/login-recover.template.html',
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
        templateUrl: 'client/login/login-update-security/login-update-security.template.html',
        controller: 'LoginUpdateSecurityCtrl',
        data: {
          pageId: 'LoginUpdateSecurity',
          noDirectAccess: true
        }
      })
      .state('loginCreatePassword', {
        url: '/login/createPassword',
        templateUrl: 'client/login/login-create-password/login-create-password.template.html',
        controller: 'LoginCreatePasswordCtrl',
        data: {
          pageId: 'LoginCreatePassword',
          noDirectAccess: true
        }
      })
      .state('dashboard', {
        url: '/home',
        templateUrl: 'client/dashboard/dealer/dashboard.template.html',
        controller: 'DashboardCtrl',
        data: {
          pageId: 'Dashboard',
          showNavBar: true,
          showMenu: false,
          title: ''
        }
      })
      .state('payments', {
        url: '/payments?filter',
        templateUrl: 'client/payments/payments.template.html',
        controller: 'PaymentsCtrl',
        data: {
          pageId: 'Payments',
          showNavBar: true,
          showMenu: false,
          title: 'Make a Payment'
        }
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: 'client/checkout/checkout.template.html',
        controller: 'CheckoutCtrl',
        data: {
          pageId: 'Checkout',
          showNavBar: true,
          showMenu: false,
          title: 'Checkout'
        }
      })
      .state('paymentsConfirm', {
        url: '/paymentsConfirm',
        templateUrl: 'client/payments/payments-confirm.template.html',
        controller: 'PaymentConfirmCtrl',
        params: {
          data: null
        },
        data: {
          pageId: 'PaymentsConfirm',
          showNavBar: true,
          showMenu: false,
          title: 'Make a Payment'
        }
      })
      .state('receipts', {
        url: '/receipts',
        templateUrl: 'client/receipts/receipts.template.html',
        controller: 'ReceiptsCtrl',
        data: {
          pageId: 'Receipts',
          showNavBar: true,
          showMenu: false,
          title: 'Receipts'
        }
      })
      .state('floorplan', {
        url: '/floorplan?filter',
        templateUrl: 'client/floor-plan/floor-plan.template.html',
        controller: 'FloorplanCtrl',
        data: {
          pageId: 'Floorplan',
          showNavBar: true,
          showMenu: false,
          title: 'View Floor Plan'
        }
      })
      .state('titlereleases', {
        url: '/titlereleases',
        templateUrl: 'client/title-releases/title-releases.html',
        controller: 'TitleReleasesCtrl',
        data: {
          pageId: 'TitleReleases',
          showNavBar: true,
          showMenu: false,
          title: 'Title Releases'
        }
      })
      .state('titleReleaseCheckout', {
        url: '/titlereleasecheckout',
        templateUrl: 'client/title-releases/title-releases-checkout/title-release-checkout.html',
        controller: 'TitleReleaseCheckoutCtrl',
        data: {
          pageId: 'TitleReleasesCheckout',
          showNavBar: true,
          showMenu: false,
          title: 'Title Releases'
        }
      })
      .state('titleReleaseConfirm', {
        url: '/titleReleaseConfirm',
        templateUrl: 'client/title-releases/title-releases-checkout/confirm-title-release/confirm-title-release.template.html',
        controller: 'ConfirmTitleReleaseCheckoutCtrl',
        params: {data: null},
        data: {
          pageId: 'TitleReleasessConfirm',
          showNavBar: true,
          showMenu: false,
          title: 'Title Releases'
        }
      })
      .state('vehicledetails', {
        url: '/vehicledetails?stockNumber',
        templateUrl: 'client/vehicle-details/vehicle-details.html',
        controller: 'VehicleDetailsCtrl',
        data: {
          pageId: 'VehicleDetails',
          showNavBar: true,
          showMenu: false,
          title: 'Vehicle Details'
        }
      })
      .state('floorcar', {
        url: '/floorcar',
        templateUrl: 'client/floor-vehicle/floor-car.template.html',
        controller: 'FloorCarCtrl',
        data: {
          pageId: 'FloorCar',
          showNavBar: true,
          showMenu: false,
          title: 'Floor a Vehicle'
        }
      })
      .state('audits', {
        url: '/audits',
        templateUrl: 'client/audits/open-audits.template.html',
        controller: 'AuditsCtrl',
        data: {
          pageId: 'Audits',
          showNavBar: true,
          showMenu: false,
          title: 'Audits'
        }
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'client/reports/dealer/reports.template.html',
        controller: 'ReportsCtrl',
        data: {
          pageId: 'Reports',
          showNavBar: true,
          showMenu: false,
          title: 'Reports'
        }
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'client/analytics/analytics.template.html',
        controller: 'AnalyticsCtrl',
        data: {
          pageId: 'Analytics',
          showNavBar: true,
          showMenu: false,
          title: 'Analytics'
        }
      })
      .state('documents', {
        url: '/documents',
        templateUrl: 'client/resources/dealer/resources.template.html',
        controller: 'DocumentsCtrl',
        data: {
          pageId: 'Documents',
          showNavBar: true,
          showMenu: false,
          title: 'Resources'
        }
      })
      .state('profile_settings', {
        url: '/profile_settings',
        templateUrl: 'client/profile-settings/dealer/profile-settings.template.html',
        controller: 'ProfileSettingsCtrl',
        data: {
          pageId: 'ProfileSettings',
          showNavBar: true,
          showMenu: false,
          title: 'Profile Settings'
        }
      })
      .state('account_management', {
        url: '/account_management',
        templateUrl: 'client/account-management/account-management.template.html',
        controller: 'AccountManagementCtrl',
        data: {
          pageId: 'AccountManagement',
          showNavBar: true,
          showMenu: false,
          title: 'Account Management'
        }
      })
      .state('promos', {
        url: '/promos',
        templateUrl: 'client/promos/promos.template.html',
        controller: 'PromosCtrl',
        data: {
          pageId: 'Promos',
          showNavBar: true,
          showMenu: false,
          title: 'Promos'
        }
      })
      .state('valueLookup', {
        url: '/valueLookup',
        templateUrl: 'client/value-lookup/value-lookup.html',
        controller: 'ValueLookupCtrl',
        data: {
          pageId: 'ValueLookup',
          showNavBar: true,
          showMenu: false,
          title: 'Value Lookup'
        }
      })
      // AUCTION STATES
      .state('auction_dashboard', {
        url: '/act/home',
        templateUrl: 'client/dashboard/auction/auction-dashboard.template.html',
        controller: 'AuctionDashboardCtrl',
        data: {
          pageId: 'AuctionDashboard',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Dashboard'
        }
      })
      .state('auction_dealersearch', {
        url: '/act/dealersearch',
        templateUrl: 'client/dealer-search/auction-dealer-search.template.html',
        controller: 'AuctionDealerSearchCtrl',
        data: {
          pageId: 'AuctionDealerSearch',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Dealer Search'
        }
      })
      .state('auction_bulkflooring', {
        url: '/act/bulkflooring',
        templateUrl: 'client/floor-vehicle/auction-bulk-flooring.template.html',
        controller: 'FloorCarCtrl',
        data: {
          pageId: 'AuctionFloorCar',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Floor a Vehicle'
        }
      })
      .state('auction_sellerfloorplan', {
        url: '/act/sellerfloorplan',
        templateUrl: 'client/floor-plan/auction-seller-floor-plan.template.html',
        controller: 'AuctionFloorplanCtrl',
        data: {
          pageId: 'AuctionFloorplan',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Floor Plan Search'
        }
      })
      .state('auction_reports', {
        url: '/act/reports',
        templateUrl: 'client/reports/auction/auction-reports.template.html',
        controller: 'AuctionReportsCtrl',
        data: {
          pageId: 'AuctionReports',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Reports'
        }
      })
      .state('auction_documents', {
        url: '/act/documents',
        templateUrl: 'client/resources/auction/auction-resources.template.html',
        controller: 'AuctionDocumentsCtrl',
        data: {
          pageId: 'AuctionDocuments',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Resources'
        }
      })
      .state('auction_settings', {
        url: '/act/settings',
        templateUrl: 'client/profile-settings/auction/auction-settings.template.html',
        controller: 'AuctionSettingsCtrl',
        data: {
          pageId: 'AuctionSettings',
          isAuctionState: true,
          showNavBar: true,
          showMenu: false,
          title: 'Settings'
        }
      });

  }
})();
