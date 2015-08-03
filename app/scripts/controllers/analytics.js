'use strict';

angular.module('nextgearWebApp')
  .controller('AnalyticsCtrl', function ($scope, $dialog, Analytics, segmentio, metric, User) {
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
            return $scope.analytics.allAuctions;
          }
        }
      };
      $dialog.dialog(dialogOptions).open();
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };

    Analytics.fetchMovers(true).then(function (data) {
      $scope.bestMovers = data;
      $scope.selectedMoverChart = $scope.bestMovers;
    });
    Analytics.fetchMovers(false).then(function (data) {
      $scope.worstMovers = data;
    });

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

    Analytics.fetchBusinessSummary().then(function (data) {
      $scope.businessSummary = data;
    });
    Analytics.fetchAnalytics().then(function (data) {
      $scope.analytics = data;
    });
    //Checking for United States Dealer
    $scope.isUnitedStates = User.isUnitedStates();
  });
