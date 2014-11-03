'use strict';

angular.module('nextgearWebApp')
  .controller('FloorCarConfirmCtrl', function ($scope, dialog, formData, isDealer, gettextCatalog) {
    // access to all the data the user entered in the form (a copy)
    $scope.formData = formData;

    // mode
    $scope.isDealer = isDealer;

    var languagePrefix = '';

    if (gettextCatalog.currentLanguage === 'fr_CA') {
      languagePrefix = 'CAF_';
    }
    else if (false /* TODO: User is English Canadian */) {
      languagePrefix = 'CAE_';
    }

    $scope.documentLink = '/documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf';

    $scope.confirm = function () {
      dialog.close(true);
    };

    $scope.close = function () {
      dialog.close(false);
    };
  });
