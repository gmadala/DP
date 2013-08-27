'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, $location, User, Floorplan, protect, OptionDefaultHelper, moment) {

    // init a special version of today's date for our datepicker which only works right with dates @ midnight UTC
    var today = new Date();
    today = moment.utc([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    //$scope.form = <form directive's controller, assigned by view>

    // user model holds "dealer static" data needed to populate form dropdowns -- use: options().foo
    $scope.options = User.getStatics;

    // form data model holds values filled into form
    $scope.data = null;

    // form data model template w/ default values for a new blank form - should be considered read-only
    $scope.defaultData = {
      ApplicationOSName: null, // string - WARNING: NOT MAPPED TO ANYTHING IN VIEW
      BuyerBankAccountId: null, // BankAccount object locally, flatten to string for API tx
      LineOfCreditId: null, // LineOfCredit object locally, flatten to string for API tx
      PaySeller: false, // Boolean, default is pay buyer
      PhysicalInventoryAddressId: null, // Location object locally, flatten to string for API tx
      SaleTradeIn: false, // Boolean, default is no
      SelectedVehicle: null, // Object returned from VIN lookup or manual vehicle lookup chain (make>model>year>style)
      SellerBusinessId: null, // business search result object locally, flatten to string for API tx
      UnitColorId: null, // Color object locally, flatten to string to API tx
      UnitMake: null, // string - should match SelectedVehicle.Make
      UnitMileage: null, // string
      UnitModel: null, // string -should match SelectedVehicle.Model
      UnitPurchaseDate: today, // Date locally, format to string for API transmission, default is today
      UnitPurchasePrice: null, // string
      UnitStyle: null, // string - should match SelectedVehicle.Style
      UnitTitleNumber: null, // string
      UnitTitleStateId: null, // State object locally, flatten to string for API tx
      UnitVin: null, // string
      VinAckLookupFailure: false, // Boolean (whether SelectedVehicle data came from VIN or manual attribute entry)
      UnitYear: null, // int - should match SelectedVehicle.Year
      TitleLocationId: null, // TitleLocationOption object locally, flatten to int for API tx
      TitleTypeId: null // null locally, int extracted from TitleLocationOption object above for API tx
    };

    $scope.optionsHelper = OptionDefaultHelper.create([
      {
        scopeSrc: 'options().locations',
        modelDest: 'PhysicalInventoryAddressId'
      },
      {
        scopeSrc: 'options().linesOfCredit',
        modelDest: 'LineOfCreditId'
      },
      {
        scopeSrc: 'options().bankAccounts',
        modelDest: 'BuyerBankAccountId'
      }
    ]);

    $scope.reset = function () {
      $scope.data = angular.copy($scope.defaultData);
      $scope.optionsHelper.applyDefaults($scope, $scope.data);
    };

    $scope.reset();

    $scope.submit = function () {
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);
      if (!$scope.form.$valid) {
        return false;
      }

      var confirmation = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/floorCarConfirm.html',
        controller: 'FloorCarConfirmCtrl',
        resolve: {
          formData: function () {
            return angular.copy($scope.data);
          }
        }
      };
      $dialog.dialog(confirmation).open().then(function (result) {
        if (result === true) {
          // submission confirmed
          $scope.reallySubmit(protect);
        }
      });
    };

    $scope.reallySubmit = function (guard) {
      if (guard !== protect) {
        throw 'FloorCarCtrl: reallySubmit can only be called from controller upon confirmation';
      }

      Floorplan.create($scope.data).then(
        function (/*success*/) {
          var title = 'Flooring Request Submitted',
            msg = 'Your flooring request has been submitted to NextGear Capital.',
            buttons = [{label: 'OK', cssClass: 'btn-primary'}];
          $dialog.messageBox(title, msg, buttons).open();
          $scope.reset();
        }, function (error) {
          $scope.submitError = error || 'Unable to submit your request. Please contact NextGear for assistance.';
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
