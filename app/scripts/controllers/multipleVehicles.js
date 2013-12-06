'use strict';

angular.module('nextgearWebApp')
  .controller('MultipleVehiclesCtrl', function ($scope, dialog, matchList) {
    $scope.matches = matchList;

    var focusField = angular.element('#inputVin');

    $scope.select = function(match) {
      dialog.close(match);
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    $scope.close = function() {
      dialog.close();
      if (focusField.length > 0) {
        focusField.focus();
      }
    };
  });
