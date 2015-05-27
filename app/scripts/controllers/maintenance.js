'use strict';

angular.module('nextgearWebApp')
  .controller('MaintenanceCtrl', function ($scope) {
    $scope.message = 'myNextGear is currently unavailable while we update it with additional features and benefits.' +
      ' We apologize for the inconvenience and appreciate your patience while we actively work to improve our service' +
      ' to you. Thank you for using myNextGear!';
  }
);
