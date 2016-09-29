(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('VinDetailsCtrl', VinDetailsCtrl);

  VinDetailsCtrl.$inject = ['$scope', 'moment', '$uibModal', '$q', 'Blackbook', 'User', 'Kbb'];

  function VinDetailsCtrl($scope, moment, $uibModal, $q, Blackbook, User, Kbb) {

    var uibModal = $uibModal;

    var s = $scope.settings = {
      // next year is the highest valid year
      maxYear: moment().add('years', 2).year(),
      vinLookupPending: false
    };

    // Convenience method for checking whether lookups that may involve user
    // interaction were rejected because the user cancelled.
    var wasUserCancelled = function (reason) {
      return reason === USER_CANCEL;
    };

    var USER_CANCEL = 'userCancel',
      pickMatch = function (matchList) {
        var options = {
          backdrop: 'static',
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
      if($scope.data) {
        $scope.data.settingsVinMode = 'none';
      }
    });

    $scope.vinIsSyntacticallyValid = function (errorObj) {
      if (!errorObj) {
        return false;
      }

      return (!errorObj.required && !errorObj.minlength && !errorObj.maxlength);
    };

    $scope.vinChange = function () {
      if ($scope.data.settingsVinMode !== 'none') {
        // if the VIN changes after lookup, clear any match state
        $scope.data.$selectedVehicle = null;
        $scope.errorFlag = false;
        $scope.data.settingsVinMode = 'none';
      }
    };

    $scope.isDealer = function () {
      return User.isDealer();
    };

    $scope.vinExit = function () {
      // on leaving VIN field, if it has a syntactically valid value that has not yet been looked up, do it now
      if ($scope.vinIsSyntacticallyValid($scope.form.inputVin.$error) && $scope.data.settingsVinMode === 'none') {
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
            pickMatch(results).then(function (item) {
              $scope.data.$selectedVehicle = item;
            });
          }
          s.vinLookupPending = false;
          $scope.data.$blackbookMileage = mileage;
          $scope.data.settingsVinMode = 'matched';
          $scope.data.dirtyStatus=true;
        },
        function (error) {
          // treat all errors as "no match" & suppress error messages
          if (error.dismiss) {
            error.dismiss();
          }
          s.vinLookupPending = false;
          if (!wasUserCancelled(error)) {
            $scope.data.settingsVinMode = 'noMatch';
            $scope.lookupValues.vehicle.years.fill();
            $scope.data.dirtyStatus = false ;
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

    $scope.resetSearch = function() {
      $scope.data.kb.years.selected = null;
      $scope.data.kb.makes.list = [];
      $scope.data.kb.makes.selected = null;
      $scope.data.kb.models.list = [];
      $scope.data.kb.models.selected = null;
      $scope.data.kb.styles.list = [];
      $scope.data.kb.styles.selected = null;
    };

    $scope.lookupValues = {
      vehicle: {
        years: {
          fill: function () {
            Kbb.getYears().then(function (years) {
              $scope.data.kb.years.list = years;
              $scope.data.kb.years.selected = null;
            });
          }
        },
        makes: {
          fill: function() {
            if($scope.data.kb.years.selected) {
              Kbb.getMakes($scope.data.kb.years.selected).then(function(makes) {
                $scope.data.kb.makes.list = makes;
                if(makes.length === 1) {
                  $scope.data.kb.makes.selected = makes[0];
                  $scope.data.kb.models.fill();
                }
              });
            } else {
              $scope.resetSearch();
            }
          }
        },
        models: {
          fill: function() {
            if($scope.data.kb.makes.selected) {
              Kbb.getModels($scope.data.kb.makes.selected, $scope.data.kb.years.selected).then(function(models) {
                $scope.data.kb.models.list = models;
                if(models.length === 1) {
                  $scope.data.kb.models.selected = models[0];
                  $scope.data.kb.styles.fill();
                }
              });
            }
          }
        },
        styles: {
          fill: function() {
            if($scope.data.kb.models.selected ) {
              Kbb.getBodyStyles($scope.data.kb.years.selected, $scope.data.kb.models.selected).then(function(bodyStyles) {
                $scope.data.kb.styles.list = bodyStyles;
                if (bodyStyles.length === 1) {
                  $scope.data.kb.styles.selected = bodyStyles[0];
                }
              });
            }
          }
        }
      }
    };
  }

})();
