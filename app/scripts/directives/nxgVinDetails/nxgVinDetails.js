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
      vinMode: 'none', // none|noMatch|matched
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

    $scope.vinChange = function () {
      if (s.vinMode !== 'none') {
        // if the VIN changes after lookup, clear any match state
        $scope.data.SelectedVehicle = null;
        s.vinMode = 'none';
      }
    };

    $scope.vinExit = function () {
      // on leaving VIN field, if it has a syntactically valid value that has not yet been looked up, do it now
      if ($scope.vinIsSyntacticallyValid($scope.form.inputVin.$error) && s.vinMode === 'none') {
        $scope.lookupVin();
      }
    };

    $scope.lookupVin = function () {
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

      s.vinLookupPending = true;
      Blackbook.fetchVehicleTypeInfoForVin($scope.data.UnitVin).then(
        function (result) {
          s.vinLookupPending = false;
          $scope.data.SelectedVehicle = result;
          s.vinMode = 'matched';
        },
        function (error) {
          s.vinLookupPending = false;
          if (!Blackbook.wasUserCancelled(error)) {
            s.vinMode = 'noMatch';
          }
          // if the user cancelled lookup, stay in the current mode
        }
      );
    };
  });
