(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('VinDetailsCtrl', VinDetailsCtrl);

  VinDetailsCtrl.$inject = ['$scope', 'moment', '$uibModal', '$q', 'Blackbook','User'];

  function VinDetailsCtrl($scope, moment, $uibModal, $q, Blackbook, User) {

    var uibModal = $uibModal;

    var s = $scope.settings = {
      // next year is the highest valid year
      maxYear: moment().add('years', 2).year(),
      vinMode: 'none', // none|noMatch|matched
      vinLookupPending: false
    };

    // Convenience method for checking whether lookups that may involve user
    // interaction were rejected because the user cancelled.
    var wasUserCancelled = function(reason) {
      return reason === USER_CANCEL;
    };

    var USER_CANCEL = 'userCancel',
      pickMatch = function (matchList) {
        var options = {
          backdrop: true,
          keyboard: false,
          backdropClick: false,
          dialogClass: 'modal modal-medium',
          templateUrl: 'client/floor-vehicle/nxg-vin-details/multiple-vehicles-modal/multiple-vehicles.template.html',
          controller: 'MultipleVehiclesCtrl',
          resolve: {
            matchList: function () {
              return matchList;
            }
          }
        };
        return uibModal.open(options).result.then(function (choice) {
          if (!choice) {
            return $q.reject(USER_CANCEL);
          } else {
            return choice;
          }
        });
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
        $scope.data.$selectedVehicle = null;
        $scope.errorFlag = false;
        s.vinMode = 'none';
      }
    };

    $scope.isDealer = function () {
      return User.isDealer() ;
    }

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
      Blackbook.lookupByVin($scope.data.UnitVin, mileage).then(
        function (results) {
          if (results.length === 1) {
            $scope.data.$selectedVehicle = results[0];
          } else { // we have multiple VIN matches
            pickMatch(results).then(function(item) {
              $scope.data.$selectedVehicle = item;
            });
          }
          s.vinLookupPending = false;
          $scope.data.$blackbookMileage = mileage;
          s.vinMode = 'matched';
        },
        function (error) {
          // treat all errors as "no match" & suppress error messages
          if (error.dismiss) {
            error.dismiss();
          }
          s.vinLookupPending = false;
          if (!wasUserCancelled(error)) {
            s.vinMode = 'noMatch';
            $scope.data.VinAckLookupFailure = false; // make sure user HAS to check this; no pre-checking

            // Clear the existing values when searching for a new not-found VIN
            $scope.data.UnitMake = '';
            $scope.data.UnitModel = '';
            $scope.data.UnitYear = '';
            $scope.data.UnitStyle = '';
          }
          // if the user cancelled lookup, stay in the current mode

        });
    };

  }
})();
