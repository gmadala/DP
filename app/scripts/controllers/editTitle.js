'use strict';

angular.module('nextgearWebApp')
  .controller('EditTitleCtrl', function ($scope, dialog) {

    $scope.close = function () {
      dialog.close();
    };

  });
