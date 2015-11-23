'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarConfirmCtrl', function ($scope, dialog, formData, fileNames, User, gettextCatalog, kissMetricInfo, segmentio, metric) {
    // access to all the data the user entered in the form (a copy)
    $scope.formData = formData;
    $scope.fileNames = fileNames;

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

    $scope.confirm = function () {
      kissMetricInfo.getKissMetricInfo().then(
        function (result) {
          if ($scope.isDealer) {
            segmentio.track(metric.DEALER_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED, result);
          } else {
            segmentio.track(metric.AUCTION_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED_PAGE, result);
          }
          $scope.kissMetricData = result;
        }
      );
      dialog.close(true);
    };

    $scope.close = function () {
      dialog.close(false);
    };
  });
