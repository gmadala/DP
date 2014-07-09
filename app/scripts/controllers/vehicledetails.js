'use strict';

angular.module('nextgearWebApp')
  .controller('VehicleDetailsCtrl', function ($scope, $stateParams, VehicleDetails, User, TitleReleases, api) { //, segmentio, metric) {
    // segmentio.track();

    $scope.stockNo = $stateParams.stockNumber;
    $scope.historyReportUrl = api.contentLink('/report/vehiclehistorydetail/' + $stateParams.stockNumber + '/VehicleHistory');

    $scope.vehicleInfo = {};
    $scope.titleInfo = {};
    $scope.flooringInfo = {};
    $scope.valueInfo = {};
    $scope.financialSummary = {};

    VehicleDetails.getVehicleInfo($scope.stockNo).then(function(info) {
      $scope.vehicleInfo = info;


    });

    VehicleDetails.getTitleInfo($scope.stockNo).then(function(info) {
      $scope.titleInfo = info;

      var displayId =  User.getInfo().BusinessNumber + '-' + $scope.titleInfo.StockNumber;
      $scope.titleInfo.TitleUrl = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + $scope.titleInfo.StockNumber); // 0 = not first page only
    });

    $scope.dealerCanRequestTitles = function() {
      return $scope.titleInfo.DealerIsEligibleToReleaseTitles;
    };

    $scope.titleRequestDisabled = function() {
      if($scope.titleInfo.TitleReleaseProgramStatus !== 'EligibleForRelease') {
        console.log('not eligible for release');
        return true;
      }

      if(TitleReleases.isFloorplanOnQueue($scope.titleInfo)) {
        console.log('already on queue, so its fine');
        return false;
      }

      // By count
      var countInQueue = TitleReleases.getQueue().length;
      if(countInQueue >= $scope.titleInfo.RemainingReleasesAvailable) {
        console.log('we reached max # requests, none left to use');
        return true;
      }

      // By financed
      var financedInQueue = TitleReleases.getQueueFinanced();
      if(financedInQueue + $scope.titleInfo.AmountFinanced > $scope.titleInfo.ReleaseBalanceAvailable) {
        console.log('we reached monetary limit, no money left to finance');
        return true;
      }

      return false;

    };

    $scope.requestTitle = function() {

    };

    VehicleDetails.getFlooringInfo($scope.stockNo).then(function(info) {
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
      $scope.showChangeLink = ($scope.flooringInfo.FloorplanStatusName === 'Approved' || $scope.flooringInfo.FloorplanStatusName === 'Pending') && $scope.inventoryLocations.length > 1;
    });

    // Update Inventory Location
    var tempAddress; // to hold current address in case user cancels change
    $scope.showEditInventoryLocation = false; // on load, inventory location select menu should be hidden

    $scope.cancelInventoryChanges = function() {
      $scope.flooringInfo.inventoryAddress = tempAddress;
      $scope.showEditInventoryLocation = false;
    };

    $scope.saveInventoryChanges = function() {
      // check to see if current location was re-selected; if so, no api call

      // make api call to save change

      $scope.showEditInventoryLocation = false;
    };

    // Show the select menu if the user has clicked "Change Address"
    $scope.showInventorySelect = function() {
      // grab current inventory location value
      tempAddress = $scope.flooringInfo.inventoryAddress;
      $scope.showEditInventoryLocation = true;
    };

    VehicleDetails.getValueInfo($scope.stockNo).then(function(info) {
      $scope.valueInfo = info;
    });

    VehicleDetails.getFinancialSummary($scope.stockNo).then(function(info) {
      $scope.financialSummary = info;

      // we need to calculate some of the values for our breakdown.
      var includeCPP = (info.CollateralProtectionPaid === 0 && info.CollateralProtectionOutstanding === 0) ? false : true;

      $scope.financialSummary.breakdown = {
        financeAmount: info.PrincipalPaid + info.PrincipalOutstanding,
        interestFeesLabel: includeCPP ? 'Interest, Fees & CPP' : 'Interest & Fees',
        interestFeesCPP: info.InterestPaid + info.InterestOutstanding + info.FeesPaid + info.FeesOutstanding + info.CollateralProtectionPaid + info.CollateralProtectionOutstanding
      };
    });
  });
