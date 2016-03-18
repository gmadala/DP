(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('AnalyticsCtrl', AnalyticsCtrl);

  AnalyticsCtrl.$inject = ['$scope', '$uibModal', 'Analytics', 'segmentio', 'metric', 'User', 'kissMetricInfo'];

  function AnalyticsCtrl($scope, $uibModal, Analytics, segmentio, metric, User, kissMetricInfo) {

    var uibModal = $uibModal;

    kissMetricInfo.getKissMetricInfo().then(
      function(result){
        segmentio.track(metric.VIEW_VIEW_ANALYTICS_PAGE, result);
      }
    );

    $scope.showDetails = false;

    $scope.chartSize = { height: 320 };

    $scope.openTopAuctions = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        dialogClass: 'modal modal-x-large',
        templateUrl: 'views/modals/top-auctions.html',
        controller: 'TopAuctionsCtrl',
        resolve: {
          auctions: function () {
            return $scope.analytics.allAuctions;
          }
        }
      };
      uibModal.open(dialogOptions);
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

  }
})();
