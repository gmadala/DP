(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('FloorCarConfirmCtrl', FloorCarConfirmCtrl);

  FloorCarConfirmCtrl.$inject = [
    '$scope',
    '$window',
    '$uibModalInstance',
    'comment',
    'formData',
    'fileNames',
    'User',
    'gettextCatalog',
    'kissMetricInfo',
    'segmentio',
    'metric'];

  function FloorCarConfirmCtrl(
    $scope,
    $window,
    $uibModalInstance,
    comment,
    formData,
    fileNames,
    User,
    gettextCatalog,
    kissMetricInfo,
    segmentio,
    metric) {

    // access to all the data the user entered in the form (a copy)
    var uibModalInstance = $uibModalInstance;
    $scope.formData = formData;
    $scope.fileNames = fileNames;
    $scope.comment = comment;

    // mode
    $scope.isDealer = User.isDealer();

    var languagePrefix = '';
    var currentLanguage = gettextCatalog.currentLanguage;
    if (!User.isUnitedStates()) {
      if (currentLanguage === 'fr_CA') {
        languagePrefix = 'CAF%20';
      } else {
        languagePrefix = 'CAE%20';
      }
    } else {
      if (currentLanguage === 'es') {
        languagePrefix = 'ES%20';
      }
    }

    $scope.documentLink = '/documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf';
    $scope.openDocument = function () {
      $window.open($scope.documentLink);
    };

    $scope.confirm = function () {

      kissMetricInfo.getKissMetricInfo().then(
        function (result) {
          result.comment = $scope.comment;

          if ($scope.isDealer) {
            segmentio.track(metric.DEALER_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED, result);
          } else {
            segmentio.track(metric.AUCTION_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED_PAGE, result);
          }
          $scope.kissMetricData = result;
        }
      );
      uibModalInstance.close(true);
    };

    $scope.close = function () {
      uibModalInstance.close(false);
    };

  }
})();
