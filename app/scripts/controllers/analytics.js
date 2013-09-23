'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog, Analytics) {

    $scope.showDetails = false;

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

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };

    $scope.bestMovers = Analytics.fetchMovers(true);
    $scope.worstMovers = Analytics.fetchMovers(false);

    $scope.selectedMoverChart = 'true';

    $scope.businessSummary = Analytics.fetchBusinessSummary();
    $scope.analytics = Analytics.fetchAnalytics();

  });
