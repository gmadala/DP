'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDashboardCtrl', function($scope) {
    $scope.foo = '';
    $scope.volume = {
      labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', ],
      datasets : [
        {
          data : [65,59,90,81,56,55]
        }
      ]
    };
  });
