'use strict';

/**
 * WARNING: This controller is used for both dealer Floor a Car AND auction Bulk Flooring. Understand
 * the ramifications to each view and test both when making any changes here!!
 */
angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, $location, $q, User, Floorplan, Addresses, Blackbook, protect, OptionDefaultHelper, moment, segmentio, metric, gettextCatalog) {

    var isDealer = User.isDealer();
    segmentio.track(metric.VIEW_FLOOR_A_VEHICLE_PAGE);

    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    //$scope.form = <form directive's controller, assigned by view>

    $q.all([User.getStatics(), User.getInfo()]).then(function(data) {
      // data[0] holds static data like colors and title locations
      // data[1] holds info data like lines of credit and bank accounts
      $scope.options = angular.extend({}, data[0], data[1]);
      $scope.options.locations = Addresses.getActivePhysical();

      var optionListsToDefault = [
        {
          scopeSrc: 'options.BankAccounts',
          modelDest: 'BankAccountId'
        },
        {
          scopeSrc: 'paySellerOptions',
          modelDest: 'PaySeller',
          useFirst: true
        }
      ];

      if (isDealer) {
        optionListsToDefault.push({
          scopeSrc: 'options.locations',
          modelDest: 'PhysicalInventoryAddressId'
        }, {
          scopeSrc: 'options.LinesOfCredit',
          modelDest: 'LineOfCreditId'
        });
      }

      $scope.optionsHelper = OptionDefaultHelper.create(optionListsToDefault);
      $scope.reset();
    });

    // pay seller vs. buyer options are derived separately
    User.getPaySellerOptions().then(function(opts) {
      $scope.paySellerOptions = opts;
    });

    User.canPayBuyer().then(function(canPay) {
      $scope.canPayBuyer = canPay;
    });

    // form data model holds values filled into form
    $scope.data = null;

    // flag to determine when to display form errors for vin detail fields.
    $scope.vinDetailsErrorFlag = false;

    // form data model template w/ default values for a new blank form - should be considered read-only
    $scope.defaultData = {
      FloorplanSourceId: User.isDealer() ? 6 : 7, // 6 for dealer in web app, 7 for auction user
      BankAccountId: null, // BankAccount object locally, flatten to string for API tx
      LineOfCreditId: null, // LineOfCredit object locally, flatten to string for API tx
      PaySeller: null, // Boolean, default is false if user is dealer and buyer payment is possible, otherwise true
      PhysicalInventoryAddressId: null, // Location object locally, flatten to string for API tx
      SaleTradeIn: false, // Boolean, default is no (only dealers that can be paid directly may change this to true)
      BusinessId: null, // business search result object locally, flatten to string for API tx
      UnitColorId: null, // Color object locally, flatten to string to API tx
      UnitMake: null, // string
      UnitMileage: null, // string
      UnitModel: null, // string
      UnitPurchaseDate: today, // Date locally, format to string for API transmission, default is today
      UnitPurchasePrice: null, // string
      UnitStyle: null, // string
      UnitVin: null, // string
      VinAckLookupFailure: false, // Boolean (whether vehicle data came from VIN or manual attribute entry)
      UnitYear: null, // int
      TitleLocationId: null, // TitleLocationOption object locally, flatten to int for API tx
      TitleTypeId: null, // null locally, int extracted from TitleLocationOption object above for API tx
      ConsignerTicketNumber: null, // string (AUCTION ONLY)
      LotNumber: null, // string (AUCTION ONLY)
      // transient local values
      $selectedVehicle: null, // Object returned from VIN lookup, populates BlackBookGroupNumber & BlackBookUvc on tx
      $blackbookMileage: null // cache most recent mileage value used to get updated blackbook data
    };

    $scope.reset = function () {
      $scope.data = angular.copy($scope.defaultData);
      $scope.optionsHelper.applyDefaults($scope, $scope.data);
      $scope.validity = undefined;
      $scope.$broadcast('reset');
    };

    // Handle setting the seller location options based on selected business (seller)
    $scope.sellerLocations = null;
    if (!isDealer) { // If we are an auction user...
      $scope.$watch('data.BusinessId', function(biz) {
        if(biz) { // And a business has been selected...
          $scope.sellerLocations = biz.ActivePhysicalInventoryLocations;

          if(_.size(biz.ActivePhysicalInventoryLocations) === 1) {
            // If there's only 1 location, auto-select it (and we disable the field in the HTML)
            $scope.data.PhysicalInventoryAddressId = $scope.sellerLocations[0];
          }
        }
      });
    }

    $scope.maxValidModelYear = new Date().getFullYear();
    $scope.minValidModelYear = 1900;
    $scope.isYear = (function() {
      var arr = $scope.maxValidModelYear.toString().split('').slice(2),
          regStr = '(19[0-9][0-9]|200[0-9]|20[0-' +  arr[0] +'][0-' +  arr[1] +'])',
          regEx = new RegExp(regStr);
      return regEx;
    })();

    $scope.submit = function () {
      //take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);

      $scope.vinDetailsErrorFlag = true;
      if (!$scope.form.$valid) {
        return false;
      }

      var confirmation = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        dialogClass: 'modal modal-medium',
        templateUrl: 'views/modals/floorCarConfirm.html',
        controller: 'FloorCarConfirmCtrl',
        resolve: {
          formData: function () {
            return angular.copy($scope.data);
          },
          isDealer: function () {
            return isDealer;
          }
        }
      };
      $dialog.dialog(confirmation).open().then(function (result) {
        if (result === true) {
          // submission confirmed
          $scope.reallySubmit(protect);
        }
      });
      return true;
    };

    $scope.reallySubmit = function (guard) {
      if (guard !== protect) {
        throw 'FloorCarCtrl: reallySubmit can only be called from controller upon confirmation';
      }

      $scope.submitInProgress = true;
      Floorplan.create($scope.data).then(
        function (/*success*/) {
          segmentio.track(isDealer ? metric.FLOOR_A_VEHICLE : metric.BULK_FLOOR_A_VEHICLE);
          $scope.submitInProgress = false;
          var title = gettextCatalog.getString('Flooring Request Submitted'),
            msg = gettextCatalog.getString('Your flooring request has been submitted to NextGear Capital.'),
            buttons = [{label: gettextCatalog.getString('Close Window'), cssClass: 'btn-cta cta-secondary'}];
          $dialog.messageBox(title, msg, buttons).open().then(function () {
            $scope.reset();
          });
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.cancel = function () {
      var title = gettextCatalog.getString('Cancel'),
        msg = gettextCatalog.getString('What would you like to do?'),
        buttons = [
          {label: gettextCatalog.getString('Go Home'), result:'home', cssClass: 'btn-cta cta-secondary btn-sm'},
          {label: gettextCatalog.getString('Start Over'), result: 'reset', cssClass: 'btn-cta cta-secondary btn-sm'},
          {label: gettextCatalog.getString('Keep Editing'), result: null, cssClass: 'btn-cta cta-primary btn-sm'}
        ];
      $dialog.messageBox(title, msg, buttons).open().then(function (choice) {
        if (choice === 'home') {
          $location.path('');
        } else if (choice === 'reset') {
          $scope.reset();
        }
      });
    };

    //Checking for United States Dealer

    if(User.isUnitedStates()) {
      $scope.mileageOrOdometer = gettextCatalog.getString('Mileage');
    }else{
      $scope.mileageOrOdometer = gettextCatalog.getString('Odometer');
    }
  });
