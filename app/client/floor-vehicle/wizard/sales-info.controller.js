(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('SalesInfoCtrl', SalesInfoCtrl);

  SalesInfoCtrl.$inject = ['$scope', 'gettext', 'gettextCatalog', 'moment', 'User'];

  function SalesInfoCtrl($scope, gettext, gettextCatalog, moment, User) {
    var vm = this;
    console.log($scope);
    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    var purchaseDateDisclaimer = gettext("To floor plan purchases older than 365 days, please contact NextGear Capital" +
      " Floorplan Services at fundingservices@nextgearcapital.com, attach the Bill of Sale," +
      " and provide the customer's NextGear Dealer Number.");
    vm.purchaseDateDisclaimer = gettextCatalog.getString(purchaseDateDisclaimer);

    var aucPurchaseDateDisclaimer = gettext("To floor plan purchases older than 7 days, please contact NextGear Capital " +
      "Floor plan Services at fundingservices@nextgearcapital.com, attach the Bill of Sale, " +
      "and provide the customer's NextGear Dealer Number.");
    vm.aucPurchaseDateDisclaimer = gettextCatalog.getString(aucPurchaseDateDisclaimer);

    vm.sample = 'This sales info is coming from the controller';

    vm.dealerMinDate = moment().subtract(364, 'days');
    vm.auctionMinDate = moment().subtract(6, 'days');
    vm.maxDate = moment();

    vm.datePicker = {
      opened: false
    };

    vm.openDatePicker = function() {
      vm.datePicker.opened = true;
    };

    vm.dateFormat = 'MM/dd/yyyy';

    $scope.$parent.wizardFloor.transitionValidation = function() {
      console.log("2. transition", $scope);
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      $scope.$parent.wizardFloor.formParts.two = $scope.form.$valid;
      return true;
    };

    // vm.defaultData = {
    //   FloorplanSourceId: User.isDealer() ? 6 : 7, // 6 for dealer in web app, 7 for auction user
    //   SaleTradeIn: false, // Boolean, default is no (only dealers that can be paid directly may change this to true)
    //   BankAccountId: null, // BankAccount object locally, flatten to string for API tx
    //   UnitPurchaseDate: today, // Date locally, format to string for API transmission, default is today
    //   UnitPurchasePrice: null, // string
    //   LineOfCreditId: null, // LineOfCredit object locally, flatten to string for API tx
    //   PaySeller: null, // Boolean, default is false if user is dealer and buyer payment is possible, otherwise true
    //   LotNumber: null, // string (AUCTION ONLY)
    //   // transient local values
    //   $selectedVehicle: null, // Object returned from VIN lookup, populates BlackBookGroupNumber & BlackBookUvc on tx
    //   $blackbookMileage: null // cache most recent mileage value used to get updated blackbook data
    // };


  }

})();
