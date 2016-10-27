(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = [
    '$state',
    '$scope',
    '$uibModal',
    '$q',
    'User',
    'Floorplan',
    'Addresses',
    'protect',
    'OptionDefaultHelper',
    'moment',
    'AccountManagement',
    'Upload',
    'nxgConfig',
    'kissMetricInfo',
    'segmentio',
    'metric'
  ];

  function WizardFloorCtrl($state,
                           $scope,
                           $uibModal,
                           $q,
                           User,
                           Floorplan,
                           Addresses,
                           protect,
                           OptionDefaultHelper,
                           moment,
                           AccountManagement,
                           Upload,
                           nxgConfig,
                           kissMetricInfo,
                           segmentio,
                           metric) {
    var vm = this;
    var isDealer = User.isDealer();

    vm.counter = 1;
    vm.validForm = true;
    vm.data = null;
    vm.formParts = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false
    };

    vm.floorPlanSubmitting = false;

    vm.pageCount = 5;

    switchState();

    var attachDocsDealer = isDealer && User.getFeatures().hasOwnProperty('uploadDocuments') ? User.getFeatures().uploadDocuments.enabled : false;
    var attachDocsAuction = !isDealer && User.getFeatures().hasOwnProperty('uploadDocumentsAuction') ? User.getFeatures().uploadDocumentsAuction.enabled : false;

    vm.attachDocumentsEnabled = User.isUnitedStates() && (attachDocsDealer || attachDocsAuction);
    vm.flooringValuationFeature = User.getFeatures().flooringValuations && User.getFeatures().flooringValuations.enabled;

    $q.all([User.getStatics(), User.getInfo(), AccountManagement.getDealerSummary()]).then(function (result) {
      vm.options = angular.extend({}, result[0], result[1]);

      var activeBankAccounts = _.filter(result[2].BankAccounts, function (bankAccount) {
        return bankAccount.IsActive === true;
      });

      vm.options.BankAccounts = _.sortBy(activeBankAccounts, 'AchBankName');
      vm.options.LinesOfCredit = _.sortBy(result[1].LinesOfCredit, "LineOfCreditName");

      var defaultBankAccount = _.find(result[2].BankAccounts, function (bankAccount) {
        return bankAccount.BankAccountId === result[1].DefaultDisbursementBankAccountId;
      });

      var defaultLineOfCredit = _.find(result[1].LinesOfCredit, function (lineOfCredit) {
        return lineOfCredit.LineOfCreditName === 'Retail';
      });

      vm.options.locations = Addresses.getActivePhysical();

      var optionListsToDefault = [
        {
          scopeSrc: 'wizardFloor.options.BankAccounts',
          modelDest: 'BankAccountId',
          useDefault: defaultBankAccount
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
        });
      }
      if(isDealer){
        if(defaultLineOfCredit){
          optionListsToDefault.push({ scopeSrc: 'wizardFloor.options.LinesOfCredit', modelDest: 'LineOfCreditId', useDefault:defaultLineOfCredit });
        }else{
          optionListsToDefault.push({ scopeSrc: 'wizardFloor.options.LinesOfCredit', modelDest: 'LineOfCreditId', useFirst:true });
        }
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
      AdditionalFinancing: false,
      additionalFinancingAmount: null,
      FloorplanSourceId: User.isDealer() ? 6 : 7, // 6 for dealer in web app, 7 for auction user
      BankAccountId: null, // BankAccount object locally, flatten to string for API tx
      LineOfCreditId: null, // LineOfCredit object locally, flatten to string for API tx
      PaySeller: 1, // Boolean, default is false if user is dealer and buyer payment is possible, otherwise true
      PhysicalInventoryAddressId: null, // Location object locally, flatten to string for API tx
      SaleTradeIn: false, // Boolean, default is no (only dealers that can be paid directly may change this to true)
      BusinessId: null, // business search result object locally, flatten to string for API tx
      UnitColorId: null, // Color object locally, flatten to string to API tx
      UnitMake: null, // string
      UnitMileage: null, // string
      UnitModel: null, // string
      UnitPurchaseDate: null, // Date locally, format to string for API transmission, default is today
      UnitPurchasePrice: null, // string
      UnitStyle: null, // string
      UnitVin: null, // string
      VinAckLookupFailure: false, // Boolean (whether vehicle data came from VIN or manual attribute entry)
      UnitYear: null, // int
      TitleLocationId: null, // TitleLocationOption object locally, flatten to int for API tx
      TitleLocationIndex: null, // For TitleLocationIndex value
      TitleTypeId: null, // null locally, int extracted from TitleLocationOption object above for API tx
      ConsignerTicketNumber: null, // string (AUCTION ONLY)
      LotNumber: null, // string (AUCTION ONLY)
      // transient local values
      $selectedVehicle: null, // Object returned from VIN lookup, populates BlackBookGroupNumber & BlackBookUvc on tx
      $blackbookMileage: null, // cache most recent mileage value used to get updated blackbook data
      files: [],
      invalidFiles: [],
      comment: '',
      commentAdditionalFinancing: '',
      commentGeneral: '',
      query: '',
      dirtyStatus: false,
      inputYear: null,
      inputMake: null,
      inputModel: null,
      inputStyle: null,
      settingsVinMode: 'none',
      kb:{
        years:{
          selected:null,
          list:[]
        },
        makes: {
          selected: null,
          list: []
        },
        models:{
          selected:null,
          list:[]
        },
        styles:{
          selected:null,
          list:[]
        }
      }
    };

    vm.reset = function () {
      vm.data = angular.copy(vm.defaultData);
      vm.optionsHelper.applyDefaults($scope, vm.data);
      vm.validity = undefined;
      vm.counter = 1;
      switchState();
      $scope.$broadcast('reset');
    };

    // Wizard Nav functions ---------------------------------------------------
    //-------------------------------------------------------------------------
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

    vm.stateChangeCounterFix = function (stateCount) {
      vm.counter = stateCount;
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
            $state.go('flooringWizard.payment');
          }

          break;
        case 4:
          if (vm.formParts.one && vm.formParts.two && vm.formParts.three) {
            $state.go('flooringWizard.document');
          }
          break;
        case 5:
          if (vm.formParts.one && vm.formParts.two && vm.formParts.three && vm.formParts.four) {
            $state.go('flooringWizard.reviewRequest');
          }

      }
    }

    function canTransition(count) {
      vm.transitionValidation();

      switch (count) {
        case 1:
          return true;
        case 2:
          return vm.formParts.one;
        case 3:
          return vm.formParts.one && vm.formParts.two;
        case 4:
          return vm.formParts.one && vm.formParts.two && vm.formParts.three;
        case 5:
          return vm.formParts.one && vm.formParts.two && vm.formParts.three && vm.formParts.four;
      }
    }

    vm.canSubmit = function () {
      if (vm.floorPlanSubmitting) {
        return false;
      }

      if (!vm.formParts.one) {
        return false;
      }

      if (!vm.formParts.two) {
        return false;
      }

      if (vm.attachDocumentsEnabled || !vm.formParts.three) {
        return false;
      }

      if (vm.attachDocumentsEnabled && vm.data.files.length < 1) {
        return false;
      }
      return true;
    };

    vm.submit = function () {
      if (!vm.transitionValidation()) {
        return;
      }

      if (vm.floorPlanSubmitting) {
        return;
      }

      if (vm.formParts.one && vm.formParts.two && (!vm.attachDocumentsEnabled || vm.formParts.three)) {
        var addressIndex = _.findIndex(vm.options.locations, {'IsMainAddress': true});

        vm.floorPlanSubmitting = true;

        vm.data.UnitYear = !vm.data.dirtyStatus ? vm.data.kb.years.selected.Value : vm.data.inputYear;
        vm.data.UnitStyle = !vm.data.dirtyStatus ? vm.data.kb.styles.selected.DisplayName : vm.data.inputStyle;
        vm.data.UnitMake = !vm.data.dirtyStatus ? vm.data.kb.makes.selected.Value : vm.data.inputMake;
        vm.data.UnitModel = !vm.data.dirtyStatus ? vm.data.kb.models.selected.Value : vm.data.inputModel;

        if (addressIndex >= 0) {
          vm.data.PhysicalInventoryAddressId = vm.options.locations[addressIndex];
        }

        vm.data.VinAckLookupFailure = vm.data.$selectedVehicle ? false : true;

      }

      var dialogParams;

      vm.floorPlanSubmitting = true;
      vm.data.TitleLocationId = vm.options.titleLocationOptions[vm.data.TitleLocationIndex];

      Floorplan.create(vm.data).then(
        function (response) {
          /**
           *  floorplan success handler
           **/
          var resultStockNumber = response.StockNumber;
          var resultFloorplanId = response.FloorplanId;
          // var stagedFiles = vm.data.files;
          var commentText = '';

          if (vm.data.commentAdditionalFinancing && vm.data.commentAdditionalFinancing.length > 0) {
            commentText += 'DEALER REQUESTS FULL PURCHASE PRICE: ' + vm.data.commentAdditionalFinancing;
          }

          commentText += (commentText.length > 0) ? ' ' + vm.data.commentGeneral : vm.data.commentGeneral;

          if (commentText.length > 0) {
            Floorplan.addComment({
              CommentText: commentText,
              FloorplanId: response.FloorplanId
            });
          }

          if (vm.data.files && vm.data.files.length > 0) {
            // Rename duplicate files with an index so they are all uploaded
            vm.data.files = _.map(vm.data.files, function (file, index) {
              var newName = vm.renameFile(file.name, index);
              if (newName !== file) {
                Upload.rename(file, newName);
              }
              return file;
            });

            var upload = Upload.upload({
              url: nxgConfig.apiBase + '/floorplan/upload/' + response.FloorplanId,
              method: 'POST',
              data: {
                file: vm.data.files
              }
            });

            upload.then(function (response) {
              vm.floorPlanSubmitting = false;

              dialogParams = response.data.Success ? buildDialog(vm.attachDocumentsEnabled, true, true) : buildDialog(vm.attachDocumentsEnabled, true, false);

              $uibModal.open(dialogParams).result.then(function () {
                vm.floorPlanSubmitting = false;
                vm.reset();

                $state.go('flooringConfirmation', {
                  floorplanId: resultFloorplanId,
                  stockNumber: resultStockNumber
                  // uploadSuccess: response.data.Success,
                  // files: (response.data.Success) ? stagedFiles : stagedFiles
                });
              });
            }, function () {
              vm.floorPlanSubmitting = false;
              dialogParams = buildDialog(vm.attachDocumentsEnabled, true, false);
              $uibModal.open(dialogParams).result.then(function () {
                vm.floorPlanSubmitting = false;
                vm.reset();
              });
            });
          } else {
            vm.floorPlanSubmitting = false;
            dialogParams = buildDialog(false, true, false);
            $uibModal.open(dialogParams).result.then(function () {
              vm.floorPlanSubmitting = false;
              vm.reset();
            });
          }
        }, function (/*floorplan error*/) {
          vm.floorPlanSubmitting = false;
          dialogParams = buildDialog(vm.attachDocumentsEnabled, false, false);
          $uibModal.open(dialogParams).result.then(function () {
            vm.floorPlanSubmitting = false;
          });
        });
    };

    function buildDialog(canAttachDocuments, floorSuccess, uploadSuccess) {

      kissMetricInfo.getKissMetricInfo().then(function (result) {
        result.comment = !!vm.data.comment && vm.data.comment.length > 0;
        result.floorplanSuccess = floorSuccess;
        result.uploadSuccess = uploadSuccess;

        segmentio.track(metric.FLOORPLAN_REQUEST_RESULT, result);
      });

      return {
        backdrop: 'static',
        keyboard: false,
        backdropClick: false,
        dialogClass: 'modal modal-medium',
        templateUrl: 'client/shared/modals/floor-car-message/floor-car-message.template.html',
        controller: 'FloorCarMessageCtrl',
        resolve: {
          canAttachDocuments: function () {
            return canAttachDocuments;
          },
          createFloorplan: function () {
            return true;
          },
          floorSuccess: function () {
            return floorSuccess;
          },
          uploadSuccess: function () {
            return uploadSuccess;
          }
        }
      };
    }
  }
})();
