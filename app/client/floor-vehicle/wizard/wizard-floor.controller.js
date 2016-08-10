(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = [
    '$state',
    '$scope',
    '$q',
    'User',
    'AccountManagement',
    'Addresses',
    'OptionDefaultHelper',
    'kissMetricInfo',
    'segmentio',
    'metric',
    'moment'
  ];

  function WizardFloorCtrl($state,
                           $scope,
                           $q,
                           User,
                           AccountManagement,
                           Addresses,
                           OptionDefaultHelper,
                           kissMetricInfo,
                           segmentio,
                           metric,
                           moment) {
    var vm = this;
    var isDealer = User.isDealer();

    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    vm.counter = 1;
    vm.validForm = true;
    vm.data = null;
    vm.formParts = {
      one: false,
      two: false,
      three: false
    };

    vm.pageCount = 3;

    switchState();

    $q.all([User.getStatics(), User.getInfo(), AccountManagement.getDealerSummary()]).then(function (result) {
      vm.options = angular.extend({}, result[0], result[1]);

      var activeBankAccounts = _.filter(result[2].BankAccounts, function (bankAccount) {
        return bankAccount.IsActive === true;
      });

      vm.options.BankAccounts = _.sortBy(activeBankAccounts, 'AchBankName');

      vm.options.locations = Addresses.getActivePhysical();

      var optionListsToDefault = [
        {
          scopeSrc: 'wizardFloor.options.BankAccounts',
          modelDest: 'BankAccountId'
        },
        {
          scopeSrc: 'wizardFloor.paySellerOptions',
          modelDest: 'PaySeller',
          useFirst: true
        }
      ];

      if (isDealer) {
        optionListsToDefault.push({
          scopeSrc: 'wizardFloor.options.locations',
          modelDest: 'PhysicalInventoryAddressId'
        }, {
          scopeSrc: 'wizardFloor.options.LinesOfCredit',
          modelDest: 'LineOfCreditId'
        });
      }

      vm.optionsHelper = OptionDefaultHelper.create(optionListsToDefault);
      vm.reset();
    });

    User.getPaySellerOptions().then(function (opts) {
      vm.paySellerOptions = opts;
    });

    User.canPayBuyer().then(function (canPay) {
      vm.canPayBuyer = canPay;
    });

    // form data model template w/ default values for a new blank form - should be considered read-only
    vm.defaultData = {
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
      $blackbookMileage: null, // cache most recent mileage value used to get updated blackbook data
      files: [],
      invalidFiles: [],
      comment: ''
    };

    vm.reset = function () {
      vm.data = angular.copy(vm.defaultData);
      vm.optionsHelper.applyDefaults($scope, vm.data);
      vm.validity = undefined;
      $scope.$broadcast('reset');
    };

    // Wizard Nav functions ---------------------------------------------------
    vm.tabClick = function (count) {
      if (canTransition(count)) {
        vm.counter = count;

        switchState();
      }
    };

    vm.nextAvailable = function () {
      return vm.counter < vm.pageCount;
    };

    vm.next = function () {
      var nextCount = vm.counter + 1;

      if (vm.nextAvailable() && canTransition(nextCount)) {
        vm.counter++;

        switchState();
      }
    };

    vm.previousAvailable = function () {
      return vm.counter > 1;
    };

    vm.previous = function () {
      if (vm.previousAvailable()) {
        vm.counter--;
        switchState();
      }
    };

    function switchState() {
      switch (vm.counter) {
        case 1:
          $state.go('flooringWizard.car');

          break;
        case 2:
          if (vm.formParts.one) {
            $state.go('flooringWizard.sales');
          }

          break;
        case 3:
          if (vm.formParts.one && vm.formParts.two) {
            $state.go('flooringWizard.document');
          }

          break;
      }
    }

    function canTransition(count) {
      vm.transitionValidation();

      switch (count) {
        case 1:
          return true;
          break;
        case 2:
          return vm.formParts.one;
          break;
        case 3:
          return vm.formParts.one && vm.formParts.two;
          break;
      }
    }
  }

})();
