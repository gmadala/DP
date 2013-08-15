'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, User, Floorplan, protect) {

    //$scope.form = <form directive's controller, assigned by view>

    // user model holds "dealer static" data needed to populate form dropdowns via user.getStatics()
    $scope.user = User;

    // form data model holds values filled into form
    $scope.data = null;

    // form data model template w/ default values for a new blank form - should be considered read-only
    $scope.defaultData = {
      ApplicationOSName: null, // string - WARNING: NOT MAPPED TO ANYTHING IN VIEW
      BuyerBankAccountId: null, // string
      LineOfCreditId: null, // string
      PaySeller: false, // Boolean, default is pay buyer
      PhysicalInventoryAddressId: null, //string
      SaleTradeIn: null, // Boolean
      SelectedVehicle: null, // Object returned from VIN lookup, if it succeeded
      SellerBusinessId: null, // string
      UnitColorId: null, // string
      UnitMake: null, // string
      UnitMileage: null, // string
      UnitModel: null, // string
      UnitPurchaseDate: new Date(), // Date locally, formatted to string for API transmission, default is today
      UnitPurchasePrice: null, // string
      UnitStyle: null, // string
      UnitTitleNumber: null, // string
      UnitTitleStateId: null, // string
      UnitVin: null, // string
      VinAckLookupFailure: null, // Boolean (must be true if SelectedVehicle is not set, I believe)
      UnitYear: null, // int
      TitleLocationId: null, // int
      TitleTypeId: null // int - WARNING: NOT MAPPED TO ANYTHING IN VIEW
    };

    $scope.reset = function () {
      $scope.data = angular.copy($scope.defaultData);
    };

    $scope.reset();

    $scope.submit = function () {
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);
      if (!$scope.form.$valid) {
        return false;
      }

      var confirmation = {}; // TODO: Define confirmation dialog
      $dialog.dialog(confirmation).then(function (result) {
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

    // TODO: Finish implementation of seller search under req #304
    $scope.openBusinessSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/businessSearch.html',
        controller: 'BusinessSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
