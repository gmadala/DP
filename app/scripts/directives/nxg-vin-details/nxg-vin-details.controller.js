(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('VinDetailsCtrl', VinDetailsCtrl);

  VinDetailsCtrl.$inject = ['$scope', 'moment', '$uibModal', '$q'];

  function VinDetailsCtrl($scope, moment, $uibModal, $q) {

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
          templateUrl: 'views/modals/multiple-vehicles.html',
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

  }
})();
