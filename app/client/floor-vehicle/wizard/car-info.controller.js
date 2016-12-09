( function() {
  'use strict';

  angular
    .module( 'nextgearWebApp' )
    .controller( 'CarInfoCtrl', CarInfoCtrl );

  CarInfoCtrl.$inject = [
    '$scope',
    'User',
    'gettextCatalog',
    'wizardService'
  ];

  function CarInfoCtrl( $scope, User, gettextCatalog, wizardService ) {
    var vm = this;

    vm.data = null;

    vm.vinDetailsErrorFlag = false;

    vm.mileageOrOdometer = User.isUnitedStates() ? gettextCatalog.getString( 'Mileage' ) : gettextCatalog.getString( 'Odometer' );

    $scope.$parent.wizardFloor.stateChangeCounterFix( 1 );

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy( $scope.form );
      $scope.$parent.wizardFloor.formParts.one = $scope.form.$valid;
      return $scope.form.$valid;
    };

    $scope.$watch(vinChanged, onDataChange);
    $scope.$watch(mileageChanged, onDataChange);

    var wizardFloor = $scope.$parent.wizardFloor;

    function vinChanged() {
      return wizardFloor.data ? wizardFloor.data.UnitVin : undefined;
    }

    function mileageChanged() {
      return wizardFloor.data ? wizardFloor.data.UnitMileage : undefined;
    }

    function onDataChange(oldValue, newValue) {
      // skip when:
      // * the data is still the same
      if (oldValue === newValue) {
        return;
      }

      // reset the valuation when:
      // * data on the parent controller is undefined
      // * unit vin is less than 10 chars
      // * mileage and vin is undefined
      if (!wizardFloor.data || _.size(wizardFloor.data.UnitVin) < 10
        || !wizardFloor.data.UnitVin || !wizardFloor.data.UnitMileage) {
        wizardFloor.valuations.valuationUnavailable = false;
        wizardFloor.valuations.blackbook = null;
        wizardFloor.valuations.mmr = null;
        return;
      }

      wizardFloor.valuations.valuationUnavailable = false;
      wizardService.getBlackbookValues(wizardFloor.data.UnitVin, wizardFloor.data.UnitMileage)
        .then(function(valuations) {
          if (valuations.length > 0) {
            var index = 0;
            if (wizardFloor.data.$selectedVehicle) {
              index = _.findIndex(valuations, function(element) {
                return element.GroupNumber === wizardFloor.data.$selectedVehicle.GroupNumber;
              });
            }
            wizardFloor.valuations.blackbook = valuations[index < 0 ? 0 : index];
          } else {
            wizardFloor.valuations.blackbook = null;
            wizardFloor.valuations.valuationUnavailable = true;
          }
        })
        .catch(function() {
          wizardFloor.valuations.blackbook = null;
          wizardFloor.valuations.valuationUnavailable = true;
        });

      wizardService.getMmrValues(wizardFloor.data.UnitVin, wizardFloor.data.UnitMileage)
        .then(function(valuations) {
          if (valuations.length > 0) {
            wizardFloor.valuations.mmr = valuations[0];
          } else {
            wizardFloor.valuations.mmr = null;
            wizardFloor.valuations.valuationUnavailable = true;
          }
        })
        .catch(function() {
          wizardFloor.valuations.mmr = null;
          wizardFloor.valuations.valuationUnavailable = true;
        });
    }
  }
} )();
