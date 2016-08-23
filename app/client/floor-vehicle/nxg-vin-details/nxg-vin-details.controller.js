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
      vinMode: 'none', // none|noMatch|matched
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

      return (!errorObj.required && !errorObj.minlength && !errorObj.maxlength);
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
      return User.isDealer();
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

    $scope.resetSearch = function() {
      kb.years.selected = null;
      kb.makes.list = [];
      kb.makes.selected = null;
      kb.models.list = [];
      kb.models.selected = null;
      kb.styles.list = [];
      kb.styles.selected = null;
    };

    $scope.lookupValues = {
      vehicle: {
        version: null,
        fields: ['years', 'makes','models','styles'],
        years: {
          selected: null,
          list: [],
          fill: function () {
            Kbb.getYears().then(function (years) {
              kb.years.list = years;
              kb.years.selected = null;
            });
          }
        },
        makes: {
          selected: null,
          list: [],
          fill: function() {
            if(kb.years.selected) {
              Kbb.getMakes(kb.years.selected).then(function(makes) {
                kb.makes.list = makes;
                if(makes.length === 1) {
                  kb.makes.selected = makes[0];
                  kb.models.fill();
                }
              });
            } else {
              $scope.resetSearch();
            }
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            if(kb.makes.selected) {
              Kbb.getModels(kb.makes.selected, kb.years.selected).then(function(models) {
                kb.models.list = models;
                if(models.length === 1) {
                  kb.models.selected = models[0];
                  kb.styles.fill();
                }
              });
            }
          }
        },
        styles: {
          selected: null,
          list: [],
          fill: function() {
            if(kb.models.selected) {
              Kbb.getBodyStyles(kb.years.selected, kb.models.selected).then(function(bodyStyles) {
                kb.styles.list = bodyStyles;
                if (bodyStyles.length === 1) {
                  kb.styles.selected = bodyStyles[0];
                }
              });
            }
          }
        }
      }
    };

    var kb = $scope.lookupValues.vehicle;
    $scope.lookupValues.vehicle.years.fill();
  }

})();
