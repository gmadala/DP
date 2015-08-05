'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope, gettextCatalog, User) {
    var languagePrefix = '';
    var isUnitedStates = User.isUnitedStates();
    var currentLanguage = gettextCatalog.currentLanguage;
    if (!isUnitedStates) {
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

    $scope.documents = [
      {
        title: gettextCatalog.getString('Welcome Packet'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Welcome%20Packet.pdf'
      },
      {
        title: gettextCatalog.getString('Instructions for Sellers'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Website%20Guide%20-%20Sellers.pdf'
      }
    ];
  });
