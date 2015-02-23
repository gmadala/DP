'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarConfirmCtrl', function ($scope, dialog, formData, User, gettextCatalog) {
    // access to all the data the user entered in the form (a copy)
    $scope.formData = formData;

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
      dialog.close(true);
    };

    $scope.close = function () {
      dialog.close(false);
    };
  });
