'use strict';

angular.module('nextgearWebApp')
  .controller('VehicleDetailsCtrl', function ($scope, $stateParams, $state, $q, $dialog, VehicleDetails, User, TitleReleases, api) {

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
      $scope.landing = info;
    });

    // Grab vehicle info
    promises.vehicleInfo.then(function(info) {
      $scope.vehicleInfo = info;
    });

    // Grab title info and define functions/variables we need to show/hide/disable the Request Title button
    promises.titleInfo.then(function(info) {
      $scope.titleInfo = info;

      var displayId =  User.getInfo().BusinessNumber + '-' + $scope.titleInfo.StockNumber;
      $scope.titleInfo.TitleUrl = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + $scope.titleInfo.StockNumber); // 0 = not first page only

      // Title-specific functions
      $scope.titleInfo.dealerCanRequestTitles = function() {
        return $scope.titleInfo.DealerIsEligibleToReleaseTitles;
      };

      $scope.titleInfo.titleRequestDisabled = function() {
        if($scope.titleInfo.TitleReleaseProgramStatus !== 'EligibleForRelease') {
          return true;
        }

        if(TitleReleases.isFloorplanOnQueue($scope.titleInfo)) {
          return false;
        }

        // By count
        var countInQueue = TitleReleases.getQueue().length;
        if(countInQueue >= $scope.titleInfo.RemainingReleasesAvailable) {
          return true;
        }

        // By financed
        var financedInQueue = TitleReleases.getQueueFinanced();
        if(financedInQueue + $scope.titleInfo.AmountFinanced > $scope.titleInfo.ReleaseBalanceAvailable) {
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

      // Grab all possible inventory locations
      $scope.inventoryLocations = User.getStatics().locations;

      // users should only be able to change inventory location if they have more than one,
      // and the Floorplan's status is either "Approved" or "pening"
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
      var //landing = info[0],
          vehicleInfo = info[1],
          titleInfo = info[2],
          flooringInfo = info[3];
          // valueInfo = info[4],
          // financialSummary = info[5];

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

      // build out payment/payoff objects for if user wants to make a payment.
    });
  });
