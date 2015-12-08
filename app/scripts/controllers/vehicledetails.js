'use strict';

angular.module('nextgearWebApp')
  .controller('VehicleDetailsCtrl', function ($scope, $stateParams, $state, $q, $dialog, $filter, VehicleDetails, User,
                                              TitleReleases, Floorplan, Payments, Addresses, api, moment, gettextCatalog,
                                              Upload, nxgConfig) {
    $scope.dataLoaded = false;

    $scope.vehicleInfo = {};
    $scope.titleInfo = {};
    $scope.flooringInfo = {};
    $scope.valueInfo = {};
    $scope.financialSummary = {};
    $scope.floorplanId = '';

    $scope.historyReportUrl = api.contentLink('/report/vehiclehistorydetail/' + $stateParams.stockNumber + '/VehicleHistory');
    $scope.isCollapsed = true;

    $scope.attachDocumentsEnabled = User.getFeatures().hasOwnProperty('uploadDocuments') ? User.getFeatures().uploadDocuments.enabled : true;

    $scope.goToCheckout = function() {
      $state.transitionTo('checkout');
    };

    $scope.onCancelScheduled = function() {
      getData();
    };

    $scope.hasOutstanding = null;

    $scope.uploadDocuments = function(){
      var dialogParams = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        dialogClass: 'modal modal-medium',
        templateUrl: 'views/modals/floorCarMessage.html',
        controller: 'FloorCarMessageCtrl',
        resolve:{
          canAttachDocuments: function() {
            return true;
          },
          floorSuccess: function(){
            return true;
          },
          createFloorplan: function(){
            return false;
          }
        }
      };

      var upload = Upload.upload({
        url: nxgConfig.apiBase + '/floorplan/upload/' + $scope.floorplanId,
        method: 'POST',
        data: {
          file: $scope.files
        }
      });

      upload.then(function(reponse) {
        if (reponse.data.Success) {
          angular.extend(dialogParams.resolve, {
            uploadSuccess: function () {
              return true;
            }
          });
        } else {
          angular.extend(dialogParams.resolve, {
            uploadSuccess: function () {
              return false;
            }
          });
        }
        $dialog.dialog(dialogParams).open().then(function(){
          $scope.files = [];
          $scope.invalidFiles = [];
        });
      }, function() {
        angular.extend(dialogParams.resolve, {
          floorSuccess: function () {
            return true;
          },
          uploadSuccess: function () {
            return false;
          }
        });
        $dialog.dialog(dialogParams).open().then(function(){
          $scope.files = [];
          $scope.invalidFiles = [];
        });
      });
    };

    $scope.removeInvalidFiles = function() {
      $scope.invalidFiles = [];
      $scope.boxDocuments.$setValidity('pattern', true);
      $scope.boxDocuments.$setValidity('maxSize', true);
      $scope.validity.boxDocuments = angular.copy($scope.boxDocuments);
      $scope.documents.$setValidity('pattern', true);
      $scope.documents.$setValidity('maxSize', true);
      $scope.validity.documents = angular.copy($scope.documents);
    };

    $scope.removeFile = function(file) {
      $scope.files = $scope.files.filter(function (f) {
        return f.name !== file.name;
      });
    };

    // we wrap the api call in a function so that we can call it initially
    // as well as after an extension has been requested.
    var getData = function() {
      VehicleDetails.getDetails($stateParams.stockNumber).then(function(details) {
        $scope.paymentQueue = Payments.getPaymentQueue();
        $scope.paymentQueue.getQueueCount = function() {
          return _.size(Payments.getPaymentQueue().payments);
        };

        $scope.floorplanId = details.FinancialSummaryInfo.FloorplanId;

        // Hide the payment options sidebar if there is no outstanding amount for the user to pay.
        $scope.hasOutstanding = details.FinancialSummaryInfo.TotalOutstanding > 0;

        // Set up variables to use for checkout (payments or titles)
        var titleForCheckout = {
          UnitMake: details.VehicleInfo.Make,
          UnitModel: details.VehicleInfo.Model,
          UnitStyle: details.VehicleInfo.Style,
          UnitVin: details.VehicleInfo.UnitVin,
          UnitYear: details.VehicleInfo.Year,
          Color: details.VehicleInfo.Color,
          StockNumber: $stateParams.stockNumber,
          AmountFinanced: details.TitleInfo.AmountFinanced,
          FloorplanId: details.TitleInfo.FloorplanId,
          FloorplanStatusName: details.TitleInfo.FloorplanStatusName,
          TitleReleaseProgramStatus: details.TitleInfo.TitleReleaseProgramStatus,
          TitleImageAvailable: details.TitleInfo.TitleImageAvailable,
          DisbursementDate: details.TitleInfo.DisbursementDate,
          TitleLocation: details.TitleInfo.TitleLocation,
          FlooringDate: details.FloorplanInfo.FlooringDate,
          DaysOnFloorplan: details.FloorplanInfo.TotalDaysFloored,
          SellerName: details.FloorplanInfo.SellerName
        };

        // we need to build the payment/payoff objects to add things to the queue.
        $scope.paymentForCheckout = {
          FloorplanId: details.FinancialSummaryInfo.FloorplanId,
          Vin: details.VehicleInfo.UnitVin,
          StockNumber: $stateParams.stockNumber,
          UnitDescription: details.FinancialSummaryInfo.Description,
          AmountDue: details.FinancialSummaryInfo.NextPaymentAmount,
          CurrentPayoff: details.FinancialSummaryInfo.TotalOutstanding,
          DueDate: moment(details.FinancialSummaryInfo.NextPaymentDueDate),

          PrincipalDue: details.FinancialSummaryInfo.PrincipalDue,
          PrincipalPayoff: details.FinancialSummaryInfo.PrincipalOutstanding,

          InterestPaymentTotal: details.FinancialSummaryInfo.InterestPaymentTotal,
          InterestPayoffTotal: details.FinancialSummaryInfo.InterestOutstanding,

          FeesPaymentTotal: details.FinancialSummaryInfo.FeesPaymentTotal,
          FeesPayoffTotal: details.FinancialSummaryInfo.FeesOutstanding,

          CollateralProtectionPaymentTotal: details.FinancialSummaryInfo.CollateralProtectionPaymentTotal,
          CollateralProtectionPayoffTotal: details.FinancialSummaryInfo.CollateralProtectionOutstanding,

          Scheduled: details.FinancialSummaryInfo.Scheduled,
          ScheduledPaymentDate: details.FinancialSummaryInfo.ScheduledPaymentDate,
          ScheduledPaymentAmount: details.FinancialSummaryInfo.ScheduledPaymentAmount,
          WebScheduledPaymentId: details.FinancialSummaryInfo.WebScheduledPaymentId,
          CurtailmentPaymentScheduled: details.FinancialSummaryInfo.CurtailmentPaymentScheduled
        };

        $scope.getAdditionalPrincipal = function() {
          if(!Payments.isPaymentOnQueue($scope.vehicleInfo.FloorplanId)) {
            return 0;
          } else {
            return Payments.getPaymentFromQueue($scope.vehicleInfo.FloorplanId).payment.additionalPrincipal;
          }
        };

        $scope.showAddPrincipalLink = function() {
          return Payments.isPaymentOnQueue($scope.vehicleInfo.FloorplanId) === 'payment';
        };

        $scope.launchPaymentOptions = function() {
          var onQueue = Payments.isPaymentOnQueue($scope.vehicleInfo.FloorplanId);

          var dialogOptions = {
            dialogClass: 'modal modal-medium',
            backdrop: true,
            keyboard: false,
            backdropClick: false,
            templateUrl: 'views/modals/paymentOptionsBreakdown.html',
            controller: 'PaymentOptionsBreakdownCtrl',
            resolve: {
              object: function() {
                return onQueue ? Payments.getPaymentFromQueue($scope.vehicleInfo.FloorplanId) : $scope.paymentForCheckout;
              },
              isOnQueue: function() {
                return onQueue;
              }
            }
          };

          $dialog.dialog(dialogOptions).open().then(function(paymentSaved) {
            if(paymentSaved) {
              // there was a scheduled payment
              if($scope.paymentForCheckout.Scheduled) {
                // cancel it
                Payments.cancelScheduled($scope.paymentForCheckout.WebScheduledPaymentId).then(function() {
                  // need to update local data for vehicle details page.
                  $scope.paymentForCheckout.WebScheduledPaymentId = null;
                  $scope.paymentForCheckout.Scheduled = false;
                  $scope.paymentForCheckout.ScheduledPaymentDate = null;
                }, function(/*error*/) {
                  // if we couldn't cancel the original, make sure we don't keep
                  // the new payment in the queue
                  Payments.removePaymentFromQueue($scope.paymentForCheckout.FloorplanId);
                });

              }
            }
          });
        };

        // Grab data for title info section
        // ================================
        $scope.titleInfo = details.TitleInfo;

        var displayId;
        User.getInfo().then(function(userInfo) {
          displayId = userInfo.BusinessNumber + '-' + details.TitleInfo.StockNumber;
          $scope.titleInfo.TitleUrl = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + details.TitleInfo.StockNumber); // 0 = not first page only
        });

        // Title-specific functions
        $scope.titleInfo.dealerCanRequestTitles = function() {
          return details.TitleInfo.DealerIsEligibleToReleaseTitles;
        };

        $scope.titleInfo.titleRequestDisabled = function() {
          if(details.TitleInfo.TitleReleaseProgramStatus !== 'EligibleForRelease') {
            return true;
          }

          if(TitleReleases.isFloorplanOnQueue($scope.titleInfo)) {
            return false;
          }

          // By count
          var countInQueue = TitleReleases.getQueue().length;
          if(countInQueue >= details.TitleInfo.RemainingReleasesAvailable) {
            return true;
          }

          // By financed
          var financedInQueue = TitleReleases.getQueueFinanced();
          if(financedInQueue + details.TitleInfo.AmountFinanced > details.TitleInfo.ReleaseBalanceAvailable) {
            return true;
          }
          return false;
        };

        $scope.titleInfo.requestTitle = function() {
          TitleReleases.addToQueue(titleForCheckout);
          $state.transitionTo('titleReleaseCheckout');
        };

        // Grab data for flooring info section
        // ===================================
        details.FloorplanInfo.sellerAddress = {
          Line1: details.FloorplanInfo.SellerAddressLine1,
          Line2: details.FloorplanInfo.SellerAddressLine2,
          City: details.FloorplanInfo.SellerAddressCity,
          State: details.FloorplanInfo.SellerAddressState,
          Zip: details.FloorplanInfo.SellerAddressZip
        };

        details.FloorplanInfo.inventoryAddress = Addresses.getAddressObjectFromId(details.FloorplanInfo.PhysicalInventoryAddressId);

        $scope.flooringInfo = details.FloorplanInfo;
        $scope.currentLocation = details.FloorplanInfo.inventoryAddress;

        $scope.flooringInfo.chart = {
          data: [
            {
              name: 'OriginalDaysFloored',
              y: $scope.flooringInfo.OriginalTermDaysFloored,
              color: '#104968'
            },
            {
              name: 'ExtendedDaysFloored',
              y: $scope.flooringInfo.ExtendedTermDaysFloored|| 0,
              color: '#1B7ABA'
            },
            {
              name: 'DaysRemaining',
              y: ($scope.flooringInfo.OriginalTermPlanLength + $scope.flooringInfo.ExtendedTermPlanLength) - ($scope.flooringInfo.OriginalTermDaysFloored + $scope.flooringInfo.ExtendedTermDaysFloored),
              color: '#E6E6E6'
            }
          ],
          size: {
            height: '180',
            width: '180'
          },
          donutOptions: {
            size: '110%',
            innerSize: '90%',
            border: true
          },
          title: {
            text: $scope.flooringInfo.TotalDaysFloored,
            style: {
              fontSize: '40px'
            },
            floating: true,
            y: 100
          }
        };

        //Grab all possible inventory locations
        $scope.inventoryLocations = Addresses.getActivePhysical();

        // Users should only be able to change inventory location if they have more than one,
        // and the Floorplan's status is either "Approved" or "Pending"
        $scope.flooringInfo.showChangeLink =
          ($scope.flooringInfo.FloorplanStatusName === gettextCatalog.getString('Approved') ||
          $scope.flooringInfo.FloorplanStatusName === gettextCatalog.getString('Pending')) &&
          $scope.inventoryLocations.length > 1;

        // Update Inventory Location
        var tempAddress;
        $scope.flooringInfo.showEditInventoryLocation = false;

        $scope.flooringInfo.cancelInventoryChanges = function() {
          $scope.flooringInfo.inventoryAddress = tempAddress;
          $scope.flooringInfo.showEditInventoryLocation = false;
        };

        $scope.flooringInfo.saveInventoryChanges = function() {
          Floorplan.editInventoryAddress({
            FloorplanId: $scope.flooringInfo.FloorplanId,
            PhysicalInventoryAddressId: $scope.flooringInfo.inventoryAddress.AddressId
          }).then(function() {}, function(/* error */) {
            $scope.flooringInfo.inventoryAddress = tempAddress;
          });
          $scope.flooringInfo.showEditInventoryLocation = false;
        };

        // Show the select menu if the user has clicked "Change Address"
        $scope.flooringInfo.showInventorySelect = function() {
          // grab current inventory location value
          tempAddress = $scope.flooringInfo.inventoryAddress;
          $scope.flooringInfo.showEditInventoryLocation = true;
        };

        // Grab data for financial summary section
        // =======================================

        // Due today/soon?
        details.FinancialSummaryInfo.NextPaymentDueDate = moment(details.FinancialSummaryInfo.NextPaymentDueDate);
        if(moment.isMoment(details.FinancialSummaryInfo.NextPaymentDueDate)){
          details.FinancialSummaryInfo.paymentOverdue = details.FinancialSummaryInfo.NextPaymentDueDate.isBefore(moment(), 'day');
          // Due today/soon?
          details.FinancialSummaryInfo.paymentDueToday = details.FinancialSummaryInfo.NextPaymentDueDate.isSame(moment(), 'day');
          // Due soon?
          details.FinancialSummaryInfo.paymentDueSoon = details.FinancialSummaryInfo.NextPaymentDueDate.diff(moment(), 'days') < 7 && !details.FinancialSummaryInfo.paymentDueToday && !details.FinancialSummaryInfo.paymentOverdue;
        }

        $scope.financialSummary = details.FinancialSummaryInfo;

        // we need to calculate some of the values for our breakdown.
        var includeCPP = (details.FinancialSummaryInfo.CollateralProtectionPaid === 0 && details.FinancialSummaryInfo.CollateralProtectionOutstanding === 0) ? false : true;

        $scope.financialSummary.breakdown = {
          financeAmount: details.FinancialSummaryInfo.PrincipalPaid + details.FinancialSummaryInfo.PrincipalOutstanding,
          interestFeesLabel: includeCPP ? gettextCatalog.getString('Interest, Fees & CPP') : gettextCatalog.getString('Interest & Fees'),
          interestFeesCPP: details.FinancialSummaryInfo.InterestPaid + details.FinancialSummaryInfo.InterestOutstanding + details.FinancialSummaryInfo.FeesPaid + details.FinancialSummaryInfo.FeesOutstanding + details.FinancialSummaryInfo.CollateralProtectionPaid + details.FinancialSummaryInfo.CollateralProtectionOutstanding
        };

        $scope.financialSummary.paidChart = {
          title: {
            useHTML: true,
            floating: true,
            text: '<h5 class="chart-label-secondary">' + gettextCatalog.getString('Paid') + '</h5> <h3 class="chart-label-primary color-success">' + $filter('currency')($scope.financialSummary.TotalPaid) + '</h3>',
            y: 80
          },
          data: [
            {
              name: gettextCatalog.getString('Principal'),
              y: details.FinancialSummaryInfo.PrincipalPaid,
              color: '#1B7ABA'
            },
            {
              name: gettextCatalog.getString('Interest'),
              y: details.FinancialSummaryInfo.InterestPaid,
              color: '#104968'
            },
            {
              name: gettextCatalog.getString('Fees'),
              y: details.FinancialSummaryInfo.FeesPaid,
              color: '#A6A8AB'
            }
          ]
        };

        $scope.financialSummary.outstandingChart = {
          title: {
            useHTML: true,
            floating: true,
            text: '<h5 class="chart-label-secondary">' + gettextCatalog.getString('Outstanding') + '</h5> <h3 class="chart-label-primary color-danger">' + $filter('currency')($scope.financialSummary.TotalOutstanding) + '</h3>',
            y: 80
          },
          data: [
            {
              name: gettextCatalog.getString('Principal'),
              y: details.FinancialSummaryInfo.PrincipalOutstanding,
              color: '#1B7ABA'
            },
            {
              name: gettextCatalog.getString('Interest'),
              y: details.FinancialSummaryInfo.InterestOutstanding,
              color: '#104968'
            },
            {
              name: gettextCatalog.getString('Fees'),
              y: details.FinancialSummaryInfo.FeesOutstanding,
              color: '#A6A8AB'
            }
          ]
        };

        if(!(details.FinancialSummaryInfo.CollateralProtectionPaid === 0 && details.FinancialSummaryInfo.CollateralProtectionOutstanding === 0)) {
          $scope.financialSummary.paidChart.data.push({
            name: gettextCatalog.getString('CPP'),
            y: details.FinancialSummaryInfo.CollateralProtectionPaid,
            color: '#6D6E70'
          });

          $scope.financialSummary.outstandingChart.data.push({
            name: gettextCatalog.getString('CPP'),
            y: details.FinancialSummaryInfo.CollateralProtectionOutstanding,
            color: '#6D6E70'
          });
        }

        $scope.financialSummary.chart = {
          donutOptions: {
            size: '125%',
            innerSize: '100%',
            border: false,
            semiCircle: true
          },
          size: {
            height: '220',
            width: '190'
          }
        };

        $scope.financialSummary.getActivityDetails = function(activity) {
          var promise, template, ctrl;
          if (activity.IsPayment) {
            promise = VehicleDetails.getPaymentDetails($stateParams.stockNumber, activity.ActivityId);
            template = 'paymentDetails.html';
            ctrl = 'PaymentDetailsCtrl';
          }

          if (activity.IsFee) {
            promise = VehicleDetails.getFeeDetails($stateParams.stockNumber, activity.ActivityId);
            template = 'feeDetails.html';
            ctrl = 'FeeDetailsCtrl';
          }

          promise.then(function(data) {
            $dialog.dialog({
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              controller: ctrl,
              templateUrl: 'views/modals/' + template,
              dialogClass: 'modal',
              resolve: {
                activity: function() {
                  return data;
                }
              }
            }).open();
          });
        };

        $scope.isPaymentOnQueue = function(id) {
          return Payments.isPaymentOnQueue(id);
        };

        // Grab data for value info section
        // ================================
        $scope.valueInfo = details.ValueInfo;

        // If any MMR value is 0, don't show MMR values.
        $scope.showMMR = (details.ValueInfo.MmrExcellentValue > 0) && (details.ValueInfo.MmrGoodValue > 0) && (details.ValueInfo.MmrAverageValue > 0) && (details.ValueInfo.MmrFairValue > 0);

        // Grab data for vehicle info section
        // ==================================
        $scope.vehicleInfo = details.VehicleInfo;

        // Handle payment extension requests
        $scope.showExtendLink = function() {
          return !!$scope.financialSummary.NextPaymentAmount && $scope.financialSummary.NextPaymentAmount === $scope.financialSummary.TotalOutstanding;
        };
        //Checking for United States Dealer
        $scope.isUnitedStates = User.isUnitedStates();

        $scope.requestExtension = function() {
          // We need a payment object, but we only need the FloorplanId, Vin, & Description properties.
          var payment = {
            FloorplanId: $scope.vehicleInfo.FloorplanId,
            Vin: $scope.vehicleInfo.UnitVin,
            UnitDescription: $scope.vehicleInfo.Description
          };

          $dialog.dialog({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            controller: 'ExtensionRequestCtrl',
            templateUrl: 'views/modals/paymentExtension.html',
            dialogClass: 'modal modal-medium',
            resolve: {
              payment: function() {
                return payment;
              },
              onConfirm: function() {
                return function() {
                  getData();
                };
              }
            }
          }).open();
        };

        $scope.dataLoaded = true;
      });
    };

    getData();
  });
