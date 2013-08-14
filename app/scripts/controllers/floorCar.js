'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, User) {

    //$scope.form = <form directive's controller, assigned by view>

    // user model holds "dealer static" data needed to populate form dropdowns via user.getStatics()
    $scope.user = User;

    // form data model holds values filled into form
    $scope.data = null;

    // default values for a new blank form - should be considered read-only
    $scope.defaultData = {
      ApplicationOSName: null, // string
      BuyerBankAccountId: null, // string
      LineOfCreditId: null, // string
      PaySeller: false, // Boolean, default is pay buyer
      PhysicalInventoryAddressId: null, //string
      SaleTradeIn: null, // Boolean
      SelectedVehicle: null, // Object from VIN lookup, if applicable
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
      TitleTypeId: null // int
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
    };

    // TODO: Move this temporary code into business search directive as part of req #304
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
