'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog, Analytics, segmentio, metric) {
    segmentio.track(metric.VIEW_VIEW_ANALYTICS_PAGE);

    $scope.showDetails = false;

    $scope.chartSize = { height: 320 };

    $scope.openTopAuctions = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        dialogClass: 'modal modal-x-large',
        templateUrl: 'views/modals/topAuctions.html',
        controller: 'TopAuctionsCtrl',
        resolve: {
          auctions: function () {
            return $scope.analytics.then(function (result) {
              return result.allAuctions;
            });
          }
        }
      };
      $dialog.dialog(dialogOptions).open();
      segmentio.track(metric.VIEW_ALL_TOP_AUCTIONS);
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };

    $scope.bestMovers = Analytics.fetchMovers(true);
    $scope.worstMovers = Analytics.fetchMovers(false);
    $scope.selectedMoverChart = $scope.bestMovers;

    $scope.changeMoverChart = function(chartName) {
      if (chartName === 'best'){
        $scope.selectedMoverChart = $scope.bestMovers;
      } else if (chartName === 'worst') {
        $scope.selectedMoverChart = $scope.worstMovers;
      }
    };

    $scope.showBest = function() {
      return $scope.selectedMoverChart === $scope.bestMovers;
    };

    $scope.businessSummary = Analytics.fetchBusinessSummary();
    $scope.analytics = Analytics.fetchAnalytics();

  });
