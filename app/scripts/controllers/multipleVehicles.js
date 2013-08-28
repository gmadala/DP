'use strict';

angular.module('nextgearWebApp')
  .controller('MultipleVehiclesCtrl', function ($scope, dialog, matchList) {
    $scope.matches = matchList;

    $scope.select = function(match) {
      dialog.close(match);
    };

    $scope.close = function() {
      dialog.close();
    };
  });
