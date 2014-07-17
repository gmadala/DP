'use strict';

angular.module('nextgearWebApp')
  .controller('VehicleDetailsCtrl', function ($scope, $stateParams, $state, $q, $dialog, $filter, VehicleDetails, User, TitleReleases, Payments, api, moment) {

    $scope.stockNo = $stateParams.stockNumber;
    $scope.historyReportUrl = api.contentLink('/report/vehiclehistorydetail/' + $stateParams.stockNumber + '/VehicleHistory');

    // Create object for each major section
    $scope.landing = {};
    $scope.vehicleInfo = {};
    $scope.titleInfo = {};
    $scope.flooringInfo = {};
    $scope.valueInfo = {};
    $scope.financialSummary = {};

    $scope.isCollapsed = true;

    // We'll populate these objects as api calls are finished
    var titleForCheckout = {};
        // paymentForCheckout = {},
        // payoffForCheckout = {};

    // Create promises for each object to grab its data as its api call finishes.
    var promises = {};
    promises.landing = VehicleDetails.getLanding($scope.stockNo);
    promises.vehicleInfo = VehicleDetails.getVehicleInfo($scope.stockNo);
    promises.titleInfo = VehicleDetails.getTitleInfo($scope.stockNo);
    promises.flooringInfo = VehicleDetails.getFlooringInfo($scope.stockNo);
    promises.valueInfo = VehicleDetails.getValueInfo($scope.stockNo);
    promises.financialSummary = VehicleDetails.getFinancialSummary($scope.stockNo);

    // Grab landing info
    promises.landing.then(function(info) {

      // Due today/soon?
      info.NextPaymentDueDate = moment(info.NextPaymentDueDate);
      if(moment.isMoment(info.NextPaymentDueDate)){
        info.paymentOverdue = info.NextPaymentDueDate.isBefore(moment(), 'day');
        // Due today/soon?
        info.paymentDueToday = info.NextPaymentDueDate.isSame(moment(), 'day');
        // Due soon?
        info.paymentDueSoon = info.NextPaymentDueDate.diff(moment(), 'days') < 7 && !info.paymentDueToday && !info.paymentOverdue;
      }

      $scope.landing = info;
    });

    // Grab vehicle info
    promises.vehicleInfo.then(function(info) {
      $scope.vehicleInfo = info;
    });

    // Grab title info and define functions/variables we need to show/hide/disable the Request Title button
    promises.titleInfo.then(function(info) {
      $scope.titleInfo = info;

      var displayId =  User.getInfo().BusinessNumber + '-' + info.StockNumber;
      $scope.titleInfo.TitleUrl = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + info.StockNumber); // 0 = not first page only

      // Title-specific functions
      $scope.titleInfo.dealerCanRequestTitles = function() {
        return info.DealerIsEligibleToReleaseTitles;
      };

      $scope.titleInfo.titleRequestDisabled = function() {
        if(info.TitleReleaseProgramStatus !== 'EligibleForRelease') {
          return true;
        }

        if(TitleReleases.isFloorplanOnQueue($scope.titleInfo)) {
          return false;
        }

        // By count
        var countInQueue = TitleReleases.getQueue().length;
        if(countInQueue >= info.RemainingReleasesAvailable) {
          return true;
        }

        // By financed
        var financedInQueue = TitleReleases.getQueueFinanced();
        if(financedInQueue + info.AmountFinanced > info.ReleaseBalanceAvailable) {
          return true;
        }
        return false;
      };

      $scope.titleInfo.requestTitle = function() {
        TitleReleases.addToQueue(titleForCheckout);
        $state.transitionTo('home.titleReleaseCheckout');
      };
    });

    // Grab flooring info and build address objects, and define functions/variables we need to save/edit inventory location
    promises.flooringInfo.then(function(info) {
      info.sellerAddress = {
        Line1: info.SellerAddressLine1,
        Line2: info.SellerAddressLine2,
        City: info.SellerAddressCity,
        State: info.SellerAddressState,
        Zip: info.SellerAddressZip
      };

      info.inventoryAddress = {
        Line1: info.InventoryAddressLine1,
        Line2: info.InventoryAddressLine2,
        City: info.InventoryAddressCity,
        State: info.InventoryAddressState,
        Zip: info.InventoryAddressZip
      };

      $scope.flooringInfo = info;
      $scope.currentLocation = info.inventoryAddress;

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

      // Grab all possible inventory locations
      $scope.inventoryLocations = User.getStatics().locations;

      // users should only be able to change inventory location if they have more than one,
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
    });

    // Grab the value info
    promises.valueInfo.then(function(info) {
      $scope.valueInfo = info;
    });

    // Grab the financial summary data and calculate the additional fields we need.
    promises.financialSummary.then(function(info) {
      $scope.financialSummary = info;

      // we need to calculate some of the values for our breakdown.
      var includeCPP = (info.CollateralProtectionPaid === 0 && info.CollateralProtectionOutstanding === 0) ? false : true;

      $scope.financialSummary.breakdown = {
        financeAmount: info.PrincipalPaid + info.PrincipalOutstanding,
        interestFeesLabel: includeCPP ? 'Interest, Fees & CPP' : 'Interest & Fees',
        interestFeesCPP: info.InterestPaid + info.InterestOutstanding + info.FeesPaid + info.FeesOutstanding + info.CollateralProtectionPaid + info.CollateralProtectionOutstanding
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
            y: info.PrincipalPaid,
            color: '#1B7ABA'
          },
          {
            name: 'Interest',
            y: info.InterestPaid,
            color: '#104968'
          },
          {
            name: 'Fees',
            y: info.FeesPaid,
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
            y: info.PrincipalOutstanding,
            color: '#1B7ABA'
          },
          {
            name: 'Interest',
            y: info.InterestOutstanding,
            color: '#104968'
          },
          {
            name: 'Fees',
            y: info.FeesOutstanding,
            color: '#A6A8AB'
          }
        ]
      };

      if(info.CollateralProtectionPaid === 0 && info.CollateralProtectionOutstanding === 0) {
        $scope.financialSummary.paidChart.data.push({
          name: 'CPP',
          y: info.CollateralProtectionPaid,
          color: '#6D6E70'
        });

        $scope.financialSummary.outstandingChart.data.push({
          name: 'CPP',
          y: info.CollateralProtectionOutstanding,
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
          promise = VehicleDetails.getPaymentDetails($scope.stockNo, activity.ActivityId);
          template = 'paymentDetails.html';
          ctrl = 'PaymentDetailsCtrl';
        }

        if (activity.IsFee) {
          promise = VehicleDetails.getFeeDetails($scope.stockNo, activity.ActivityId);
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
    });

    // Once all api calls have finished, we can populate the objects needed
    // for requesting a title and making and payment or payoff.
    $q.all([
      promises.landing,
      promises.vehicleInfo,
      promises.titleInfo,
      promises.flooringInfo,
      promises.valueInfo,
      promises.financialSummary
    ]).then(function(info){
      var landingInfo = info[0],
          vehicleInfo = info[1],
          titleInfo = info[2],
          flooringInfo = info[3];

      // build out title object for if user wants to request it
      titleForCheckout = {
        UnitMake: vehicleInfo.Make,
        UnitModel: vehicleInfo.Model,
        UnitStyle: vehicleInfo.Style,
        UnitVin: vehicleInfo.UnitVin,
        UnitYear: vehicleInfo.Year,
        Color: vehicleInfo.Color,
        StockNumber: $scope.StockNo,
        AmountFinanced: titleInfo.AmountFinanced,
        FloorplanId: titleInfo.FloorplanId,
        FloorplanStatusName: titleInfo.FloorplanStatusName,
        TitleReleaseProgramStatus: titleInfo.TitleReleaseProgramStatus,
        TitleImageAvailable: titleInfo.TitleImageAvailable,
        TitleReleaseDate: titleInfo.TitleReleaseDate,
        TitleReleaseLocation: titleInfo.TitleReleaseLocation,
        FlooringDate: flooringInfo.FlooringDate,
        DaysOnFloorplan: flooringInfo.TotalDaysFloored,
        SellerName: flooringInfo.SellerName
      };

      // we need data from getLanding & getFinancialSummary for requesting an extension
      $scope.landing.showExtendLink = function() {
        return !!landingInfo.NextPaymentAmount && landingInfo.NextPaymentAmount === landingInfo.TotalOutstandingAmount;
      };

      $scope.landing.requestExtension = function() {
        // We need a payment object, but we only need the FloorplanId & Vin.
        var payment = {
          FloorplanId: landingInfo.FloorplanId,
          Vin: landingInfo.UnitVin,
          UnitDescription: landingInfo.Description
        };

        $dialog.dialog({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            controller: 'ExtensionRequestCtrl',
            templateUrl: 'views/modals/paymentExtension.html',
            dialogClass: 'modal extension-modal',
            resolve: {
              payment: function() {
                return payment;
              },
              confirmRequest: function() {
                return function() {
                  if(payment.Extendable) {
                    return Payments.requestExtension(payment.FloorplanId);
                  } else {
                    // shouldn't be calling this method
                    return $q.reject();
                  }
                };
              }
            }
          }).open();
      };

      // build out payment/payoff objects for if user wants to make a payment.
    });
  });
