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

    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    vm.counter = 1;
    vm.validForm = true;
    vm.data = null;
    vm.formParts = {
      one: false,
      two: false,
      three: false,
      four: false
    };

    vm.floorPlanSubmitting = false;

    vm.pageCount = 4;

    switchState();

    var attachDocsDealer = isDealer && User.getFeatures().hasOwnProperty('uploadDocuments') ? User.getFeatures().uploadDocuments.enabled : false;
    var attachDocsAuction = !isDealer && User.getFeatures().hasOwnProperty('uploadDocumentsAuction') ? User.getFeatures().uploadDocumentsAuction.enabled : false;

    vm.attachDocumentsEnabled = User.isUnitedStates() && (attachDocsDealer || attachDocsAuction);

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
      vm.counter = 1;
      switchState();
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
        case 4:
          if (vm.formParts.one && vm.formParts.two && vm.formParts.three) {
            $state.go('flooringWizard.document');
          }
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
        case 4:
          return vm.formParts.one && vm.formParts.two && vm.formParts.three;
          break;
      }
    }

    vm.canSubmit = function () {
      if (vm.floorPlanSubmitting)
        return false;

      if (!vm.formParts.one)
        return false;

      if (!vm.formParts.two)
        return false;

      if (vm.attachDocumentsEnabled || !vm.formParts.three)
        return false;

      if (vm.attachDocumentsEnabled && vm.data.files.length < 1)
        return false;

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

        vm.floorPlanSubmitting = true;

        var confirmation = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          size: 'md',
          templateUrl: 'client/floor-vehicle/floor-car-confirm-modal/floor-car-confirm.template.html',
          controller: 'FloorCarConfirmCtrl',
          resolve: {
            comment: function () {
              return !!vm.data.comment && vm.data.comment.length > 0;
            },
            formData: function () {
              return angular.copy(vm.data);
            },
            fileNames: function () {
              var index = 0;
              return _.map(vm.data.files, function (file) {
                index++;
                return vm.renameFile(file.name, index - 1);
              });
            }
          }
        };
        $uibModal.open(confirmation).result.then(function (result) {
          if (result === true) {
            // submission confirmed
            vm.reallySubmit(protect);
          } else {
            vm.floorPlanSubmitting = false;
          }
        });
      }
    };

    vm.reallySubmit = function (guard) {
      if (guard !== protect) {
        vm.floorPlanSubmitting = false;
        throw 'FloorCarCtrl: reallySubmit can only be called from controller upon confirmation';
      }

      var dialogParams;

      vm.floorPlanSubmitting = true;
      Floorplan.create(vm.data).then(
        function (response) { /*floorplan success*/
          if (vm.data.comment) {
            Floorplan.addComment({
              CommentText: vm.data.comment,
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
        backdrop: true,
        keyboard: true,
        backdropClick: true,
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
