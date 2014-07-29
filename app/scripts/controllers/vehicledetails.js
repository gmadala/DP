'use strict';

angular.module('nextgearWebApp')
  .controller('VehicleDetailsCtrl', function ($scope, $stateParams, $state, $q, $dialog, $filter, VehicleDetails, User, TitleReleases, Payments, api, moment) {

    $scope.vehicleInfo = {};
    $scope.titleInfo = {};
    $scope.flooringInfo = {};
    $scope.valueInfo = {};
    $scope.financialSummary = {};

    $scope.historyReportUrl = api.contentLink('/report/vehiclehistorydetail/' + $stateParams.stockNumber + '/VehicleHistory');
    $scope.isCollapsed = true;

    $scope.goToCheckout = function() {
      $state.transitionTo('home.checkout');
    };

    VehicleDetails.getDetails($stateParams.stockNumber).then(function(details) {
      $scope.paymentQueue = Payments.getPaymentQueue();
      $scope.paymentQueue.getQueueCount = function() {
        return _.size(Payments.getPaymentQueue().payments);
      };

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
        DueDate: moment(details.FinancialSummaryInfo.NextPaymentDueDate),
        isPayoff: false,
        PrincipalDue: details.FinancialSummaryInfo.PrincipalDue,
        InterestPaymentTotal: details.FinancialSummaryInfo.InterestPaymentTotal,
        FeesPaymentTotal: details.FinancialSummaryInfo.FeesPaymentTotal,
        CollateralProtectionPaymentTotal: details.FinancialSummaryInfo.CollateralProtectionPaymentTotal,
        Scheduled: details.FinancialSummaryInfo.Scheduled
      };

      $scope.payoffForCheckout = {
        FloorplanId: details.FinancialSummaryInfo.FloorplanId,
        Vin: details.VehicleInfo.UnitVin,
        StockNumber: $stateParams.stockNumber,
        UnitDescription: details.FinancialSummaryInfo.Description,
        CurrentPayoff: details.FinancialSummaryInfo.TotalOutstanding,
        DueDate: moment(details.FinancialSummaryInfo.NextPaymentDueDate),
        isPayoff: true,
        PrincipalPayoff: details.FinancialSummaryInfo.PrincipalDue,
        InterestPayoffTotal: details.FinancialSummaryInfo.InterestPayoffTotal,
        FeesPayoffTotal: details.FinancialSummaryInfo.FeesPayoffTotal,
        CollateralProtectionPayoffTotal: details.FinancialSummaryInfo.CollateralProtectionPayoffTotal,
        Scheduled: details.FinancialSummaryInfo.Scheduled
      };

      $scope.cancelScheduledPayment = function() {
        // var dialogOptions = {
        //   backdrop: true,
        //   keyboard: true,
        //   backdropClick: true,
        //   templateUrl: 'views/modals/cancelPayment.html',
        //   controller: 'CancelPaymentCtrl',
        //   resolve: {
        //     options: function() {
        //       return {
        //         payment: {
        //           webScheduledPaymentId: details.FinancialSummaryInfo.WebScheduledPaymentId,
        //           vin: details.VehicleInfo.UnitVin,
        //           description: details.FinancialSummaryInfo.Description,
        //           stockNumber: $stateParams.stockNumber,
        //           scheduledDate: details.FinancialSummaryInfo.ScheduledPaymentDate,
        //           isPayOff: !details.FinancialSummaryInfo.CurtailmentPaymentScheduled,
        //           currentPayOff: details.FinancialSummaryInfo.TotalOutstanding,
        //           amountDue: null // don't know this yet (7/29/14)
        //         },
        //         onCancel: function() {
        //           // we don't have anything to clean up here...?
        //         }
        //       };
        //     }
        //   }
        // };
        // $dialog.dialog(dialogOptions).open();
      },


      // Grab data for title info section
      // ================================
      $scope.titleInfo = details.TitleInfo;

      var displayId =  User.getInfo().BusinessNumber + '-' + details.TitleInfo.StockNumber;
      $scope.titleInfo.TitleUrl = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + details.TitleInfo.StockNumber); // 0 = not first page only

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
        $state.transitionTo('home.titleReleaseCheckout');
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

      details.FloorplanInfo.inventoryAddress = {
        Line1: details.FloorplanInfo.InventoryAddressLine1,
        Line2: details.FloorplanInfo.InventoryAddressLine2,
        City: details.FloorplanInfo.InventoryAddressCity,
        State: details.FloorplanInfo.InventoryAddressState,
        Zip: details.FloorplanInfo.InventoryAddressZip
      };

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
      $scope.inventoryLocations = User.getStatics().locations;

      // Users should only be able to change inventory location if they have more than one,
      // and the Floorplan's status is either "Approved" or "Pending"
      $scope.flooringInfo.showChangeLink = ($scope.flooringInfo.FloorplanStatusName === 'Approved' || $scope.flooringInfo.FloorplanStatusName === 'Pending') && $scope.inventoryLocations.length > 1;

      // Update Inventory Location
      var tempAddress;

      // on load, inventory location select menu should be hidden
      $scope.flooringInfo.showEditInventoryLocation = false;

      $scope.flooringInfo.cancelInventoryChanges = function() {
        $scope.flooringInfo.inventoryAddress = tempAddress;
        $scope.flooringInfo.showEditInventoryLocation = false;
      };

      $scope.flooringInfo.saveInventoryChanges = function() {
        // check to see if current location was re-selected; if so, no api call

        // make api call to save change

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
        interestFeesLabel: includeCPP ? 'Interest, Fees & CPP' : 'Interest & Fees',
        interestFeesCPP: details.FinancialSummaryInfo.InterestPaid + details.FinancialSummaryInfo.InterestOutstanding + details.FinancialSummaryInfo.FeesPaid + details.FinancialSummaryInfo.FeesOutstanding + details.FinancialSummaryInfo.CollateralProtectionPaid + details.FinancialSummaryInfo.CollateralProtectionOutstanding
      };

      $scope.financialSummary.paidChart = {
        title: {
          useHTML: true,
          floating: true,
          text: '<h5 class="chart-label-secondary">Total Paid</h5> <h3 class="chart-label-primary color-success">' + $filter('currency')($scope.financialSummary.TotalPaid) + '</h3>',
          y: 70
        },
        data: [
          {
            name: 'Principal',
            y: details.FinancialSummaryInfo.PrincipalPaid,
            color: '#1B7ABA'
          },
          {
            name: 'Interest',
            y: details.FinancialSummaryInfo.InterestPaid,
            color: '#104968'
          },
          {
            name: 'Fees',
            y: details.FinancialSummaryInfo.FeesPaid,
            color: '#A6A8AB'
          }
        ]
      };

      $scope.financialSummary.outstandingChart = {
        title: {
          useHTML: true,
          floating: true,
          text: '<h5 class="chart-label-secondary">Outstanding</h5> <h3 class="chart-label-primary color-danger">' + $filter('currency')($scope.financialSummary.TotalOutstanding) + '</h3>',
          y: 70
        },
        data: [
          {
            name: 'Principal',
            y: details.FinancialSummaryInfo.PrincipalOutstanding,
            color: '#1B7ABA'
          },
          {
            name: 'Interest',
            y: details.FinancialSummaryInfo.InterestOutstanding,
            color: '#104968'
          },
          {
            name: 'Fees',
            y: details.FinancialSummaryInfo.FeesOutstanding,
            color: '#A6A8AB'
          }
        ]
      };

      if(details.FinancialSummaryInfo.CollateralProtectionPaid === 0 && details.FinancialSummaryInfo.CollateralProtectionOutstanding === 0) {
        $scope.financialSummary.paidChart.data.push({
          name: 'CPP',
          y: details.FinancialSummaryInfo.CollateralProtectionPaid,
          color: '#6D6E70'
        });

        $scope.financialSummary.outstandingChart.data.push({
          name: 'CPP',
          y: details.FinancialSummaryInfo.CollateralProtectionOutstanding,
          color: '#6D6E70'
        });
      }

      $scope.financialSummary.chart = {
        donutOptions: {
          size: '110%',
          innerSize: '90%',
          border: false,
          semiCircle: true
        },
        size: {
          height: '220',
          width: '220',
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

      // Grab data for value info section
      // ================================
      $scope.valueInfo = details.ValueInfo;

      // Grab data for vehicle info section
      // ==================================
      $scope.vehicleInfo = details.VehicleInfo;

      // Handle payment extension requests
      $scope.showExtendLink = function() {
        return !!$scope.financialSummary.NextPaymentAmount && $scope.financialSummary.NextPaymentAmount === $scope.financialSummary.TotalOutstanding;
      };

      $scope.requestExtension = function() {
        // We need a payment object, but we only need the FloorplanId, Vin, Description, & Extendable property.
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
            }//,
            // confirmRequest: function() {
            //   return function() {
            //     if(payment.Extendable) {
            //       return Payments.requestExtension(payment.FloorplanId);
            //     } else {
            //       // shouldn't be calling this method
            //       return $q.reject();
            //     }
            //   };
            // }
          }
        }).open();
      };
    });
  });
