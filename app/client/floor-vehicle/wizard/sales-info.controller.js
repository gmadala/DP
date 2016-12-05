(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('SalesInfoCtrl', SalesInfoCtrl);

  SalesInfoCtrl.$inject = ['$scope', 'gettext', 'gettextCatalog', 'moment', 'wizardService'];

  function SalesInfoCtrl($scope, gettext, gettextCatalog, moment, wizardService) {
    var vm = this;

    // init a special version of today's date for our datepicker which only works right with dates @ midnight
    var today = new Date();
    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    var purchaseDateDisclaimer = gettext("Your purchase date is older than 365 days.  Please contact Floor Plan Services at fundingservices@nextgearcapital.com.");
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

    vm.onPurchaseDateChange = function(viewValue) {
      vm.purchaseDateHasValue = !!viewValue;
    };

    vm.switchChange = function (isTradeIn) {
      if ($scope.$parent.wizardFloor.data) {
        $scope.$parent.wizardFloor.data.PaySeller = isTradeIn ? false : null;

        if (!$scope.$parent.wizardFloor.canPayBuyer) {
          $scope.$parent.wizardFloor.data.PaySeller = true;
        }

        $scope.$parent.wizardFloor.formParts.three =
          $scope.$parent.wizardFloor.formParts.three && ($scope.$parent.wizardFloor.data.PaySeller !== null);
      }
    };

    $scope.$parent.wizardFloor.stateChangeCounterFix(2);

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      $scope.$parent.wizardFloor.formParts.two = $scope.form.$valid;
      return $scope.form.$valid;
    };

    var wizardFloor = $scope.$parent.wizardFloor;
    wizardService.getMmrValues(wizardFloor.data.UnitVin, wizardFloor.data.UnitMileage)
      .then(function(valuations) {
        vm.mmrValuations = valuations;
        if (wizardFloor.valuations.mmr) {
          vm.selectedMmrValuation = _.find(vm.mmrValuations, function(element) {
            return element.MakeId === wizardFloor.valuations.mmr.MakeId &&
              element.ModelId === wizardFloor.valuations.mmr.ModelId &&
              element.YearId === wizardFloor.valuations.mmr.YearId &&
              element.BodyId === wizardFloor.valuations.mmr.BodyId
          });
        }
      });

    vm.onMmrValuationsChange = function(value) {
      wizardFloor.valuations.mmr = value;
    }
  }

})();
