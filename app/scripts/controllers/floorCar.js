'use strict';

/**
 * WARNING: This controller is used for both dealer Floor a Car AND auction Bulk Flooring. Understand
 * the ramifications to each view and test both when making any changes here!!
 */
angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, $location, User, Floorplan, Blackbook, protect, OptionDefaultHelper, moment, segmentio, metric) {

    var isDealer = User.isDealer();

    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    //$scope.form = <form directive's controller, assigned by view>

    // user model holds "dealer static" data needed to populate most form dropdowns -- use: options().foo
    $scope.options = User.getStatics;

    // pay seller vs. buyer options are derived separately
    $scope.paySellerOptions = User.getPaySellerOptions;
    $scope.canPayBuyer = User.canPayBuyer;

    // form data model holds values filled into form
    $scope.data = null;

    // form data model template w/ default values for a new blank form - should be considered read-only
    $scope.defaultData = {
      FloorplanSourceId : 6, // always 6 for web app
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
      UnitTitleNumber: null, // string
      UnitTitleStateId: null, // State object locally, flatten to string for API tx
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

    var optionListsToDefault = [
      {
        scopeSrc: 'options().bankAccounts',
        modelDest: 'BankAccountId'
      },
      {
        scopeSrc: 'paySellerOptions()',
        modelDest: 'PaySeller',
        useFirst: true
      }
    ];
    if (isDealer) {
      optionListsToDefault.push({
        scopeSrc: 'options().locations',
        modelDest: 'PhysicalInventoryAddressId'
      }, {
        scopeSrc: 'options().linesOfCredit',
        modelDest: 'LineOfCreditId'
      });
    }
    $scope.optionsHelper = OptionDefaultHelper.create(optionListsToDefault);

    // if user switches to a title location that does not allow title info, clear any info already entered
    $scope.$watch('data.TitleLocationId.TitleInfoEnabled', function (titleInfoEnabled) {
      if (titleInfoEnabled === false) {
        $scope.data.UnitTitleNumber = null;
        $scope.data.UnitTitleStateId = null;
      }
    });

    $scope.reset = function () {
      $scope.data = angular.copy($scope.defaultData);
      $scope.optionsHelper.applyDefaults($scope, $scope.data);
      $scope.validity = undefined;
      $scope.$broadcast('reset');
    };

    $scope.reset();

    $scope.isValidSaleDate = function (date) {
      // there might be no date if we're part of a validator chain
      if (!date) { return false; }
      return !moment().isBefore(date, 'day');
    };

    $scope.mileageExit = function(modelCtrl) {
      var newMileage = $scope.data.UnitMileage;
      if (!$scope.data.$selectedVehicle || !modelCtrl.$valid ||
          newMileage === $scope.data.$blackbookMileage) {
        return;
      }

      Blackbook.fetchVehicleTypeInfoForVin(
          $scope.data.UnitVin,
          newMileage,
          $scope.data.$selectedVehicle).then(
        function (result) {
          $scope.data.$selectedVehicle = result;
          $scope.data.$blackbookMileage = newMileage;
        }, function (/*error*/) {
          $scope.data.$blackbookMileage = null;
        }
      );
    };

    $scope.maxValidModelYear = new Date().getFullYear() + 1;
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
      if (!$scope.form.$valid) {
        return false;
      }

      var confirmation = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        dialogClass: 'modal floor-confirmation-modal',
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
          var title = 'Flooring Request Submitted',
            msg = 'Your flooring request has been submitted to NextGear Capital.',
            buttons = [{label: 'OK', cssClass: 'btn btn-mini btn-primary'}];
          $dialog.messageBox(title, msg, buttons).open().then(function () {
            $scope.reset();
          });
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.cancel = function () {
      var title = 'Cancel',
        msg = 'What would you like to do?',
        buttons = [
          {label: 'Go Home', result:'home', cssClass: 'btn-danger'},
          {label: 'Start Over', result: 'reset', cssClass: 'btn-danger'},
          {label: 'Keep Editing', result: null, cssClass: 'btn-primary'}
        ];
      $dialog.messageBox(title, msg, buttons).open().then(function (choice) {
        if (choice === 'home') {
          $location.path('');
        } else if (choice === 'reset') {
          $scope.reset();
        }
      });
    };

  });
