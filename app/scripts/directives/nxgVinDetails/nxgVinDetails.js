'use strict';

angular.module('nextgearWebApp')
  .directive('nxgVinDetails', function () {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgVinDetails/nxgVinDetails.html',
      scope: {
        data: '=floorModel',
        validity: '=',
        form: '='
      },
      controller: 'VinDetailsCtrl'
    };
  })
  .controller('VinDetailsCtrl', function ($scope, moment, Blackbook) {

    var s = $scope.settings = {
      // next year is the highest valid year
      maxYear: moment().add('years', 1).year(),
      vinMode: 'none', // none|noMatch|matched|noVin
      vinLookupPending: false
    };

    $scope.$on('reset', function () {
      s.vinMode = 'none';
    });

    $scope.vinIsSyntacticallyValid = function (errorObj) {
      if (!errorObj) {
        return false;
      }
      return (!errorObj.required &&
        !errorObj.minlength &&
        !errorObj.maxlength);
    };

    $scope.checkVinMode = function() {
      // This will return a value we can use to set our nxg-requires attribute on the vin input
      if ($scope.settings.vinMode === 'matched' || $scope.settings.vinMode === 'noMatch' || $scope.settings.vinMode === 'noVin') {
        return true;
      }
      return false;
    };

    $scope.vinChange = function () {
      if (s.vinMode !== 'none') {
        // if the VIN changes after lookup, clear any match state
        $scope.data.$selectedVehicle = null;
        s.vinMode = 'none';
      }
    };

    $scope.noVin = function() {
      // There is no VIN for this vehicle, display make/model/year/style inputs
      s.vinMode = 'noVin';
      $scope.data.VinAckLookupFailure = true;

      if ($scope.form.inputVin.$error.required) {
        $scope.form.inputVin.$error.required = false;
      }
    };

    $scope.vinExit = function () {
      // on leaving VIN field, if it has a syntactically valid value that has not yet been looked up, do it now
      if ($scope.vinIsSyntacticallyValid($scope.form.inputVin.$error) && s.vinMode === 'none') {
        $scope.lookupVin();
      }
    };

    $scope.lookupVin = function () {
      var mileage = null;
      // disable this while a lookup is already running
      if (s.vinLookupPending) {
        return;
      }

      // reset VIN validity
      $scope.validity = angular.extend($scope.validity || {}, {
        inputVin: {$error: {}}
      });

      // if VIN fails basic syntax validation, bail and expose the error
      if (!$scope.vinIsSyntacticallyValid($scope.form.inputVin.$error)) {
        $scope.validity = angular.extend($scope.validity || {}, {
          inputVin: angular.copy($scope.form.inputVin)
        });
        return;
      }

      // check if we have valid mileage to send
      if ($scope.form.inputMileage.$valid) {
        mileage = $scope.data.UnitMileage;
      }

      s.vinLookupPending = true;
      Blackbook.fetchVehicleTypeInfoForVin($scope.data.UnitVin, mileage).then(
        function (result) {
          s.vinLookupPending = false;
          $scope.data.$selectedVehicle = result;
          $scope.data.$blackbookMileage = mileage;
          s.vinMode = 'matched';
        },
        function (error) {
          // treat all errors as "no match" & suppress error messages
          if (error.dismiss) {
            error.dismiss();
          }
          s.vinLookupPending = false;
          if (!Blackbook.wasUserCancelled(error)) {
            s.vinMode = 'noMatch';
          }
          // if the user cancelled lookup, stay in the current mode
        }
      );
    };
  });
