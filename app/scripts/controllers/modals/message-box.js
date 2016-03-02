/**
 * Created by gayathrimadala on 1/26/16.
 */
'use strict';

angular.module('nextgearWebApp')
  .controller('MessageBoxCtrl', function ($scope, title, message, buttons, $uibModalInstance) {
    var uibModalInstance = $uibModalInstance;
    $scope.title = title;
    $scope.message = message;

    $scope.buttons = {
      label : buttons[0].label,
      cssClass : buttons[0].cssClass
    };

    $scope.ok = function() {
      uibModalInstance.close();
    };

  });
