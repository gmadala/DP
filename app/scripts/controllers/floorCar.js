'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarCtrl', function($scope, $dialog, User) {

    // user model holds "dealer static" data needed to populate form dropdowns via user.getStatics()
    $scope.user = User;

    // default values for a new blank form
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
      VinAckLookupFailure: null, // Boolean (should be true if SelectedVehicle is not set, I believe)
      UnitYear: null, // int
      TitleLocationId: null, // int
      TitleTypeId: null // int
    };

    $scope.reset = function () {
      $scope.data = angular.copy($scope.defaultData);
    };

    $scope.reset();

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
