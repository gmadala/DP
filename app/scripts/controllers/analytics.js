'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog) {
    $scope.averageTurn = {
      labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", ],
      datasets : [
        {
          data : [65,59,90,81,56,55]
        }
      ]
    };
    $scope.bestMovers = {
      labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", ],
      datasets : [
        {
          data : [65,59,90,81,56,55]
        }
      ]
    };
    $scope.worstMovers = {
      labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", ],
      datasets : [
        {
          data : [65,59,90,81,56,55]
        }
      ]
    };
    $scope.top10auctions = {
      labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", ],
      datasets : [
        {
          data : [65,59,90,81,56,55]
        }
      ]
    };
    $scope.openTopAuctions = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/topAuctions.html',
        controller: 'TopAuctionsCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
