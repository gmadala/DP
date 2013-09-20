'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog, Analytics) {

    $scope.moversOptions = ['The best movers.', 'The worst movers.'];
    $scope.moversSelection = $scope.moversOptions[0];

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

    $scope.toggleMovers = function() {
      if ($scope.moversSelection === $scope.moversOptions[0]) {
        if (!$scope.bestMovers) { $scope.bestMovers = Analytics.fetchMovers(true); }
      }
      else {
        if (!$scope.worstMovers) { $scope.worstMovers = Analytics.fetchMovers(false); }
      }
    };

    $scope.businessSummary = Analytics.fetchBusinessSummary();
    $scope.analytics = Analytics.fetchAnalytics();
    $scope.toggleMovers();

  });
