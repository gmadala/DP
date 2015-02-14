'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api, metric, segmentio, gettextCatalog, User) {
    segmentio.track(metric.VIEW_RESOURCES_PAGE);
    $scope.metric = metric; // make metric names available to templates

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
        title: gettextCatalog.getString('Dealer Funding Checklist'),
        url: 'documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf'
      },
      {
        title: gettextCatalog.getString('Instructions for Buyers'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf'
      }
    ];

    $scope.collateralProtection = [
      {
        title: gettextCatalog.getString('Welcome Letter'),
        url: 'documents/' + languagePrefix + 'Welcome%20Letter.pdf'
      },
      {
        title: gettextCatalog.getString('Guidelines'),
        url: 'documents/' + languagePrefix + 'Insurance%20Guidelines.pdf'
      },
      {
        title: gettextCatalog.getString('Information Sheet'),
        url: 'documents/' + languagePrefix + 'Information%20Sheet.pdf'
      },
      {
        title: gettextCatalog.getString('Claim Form'),
        url: 'documents/' + languagePrefix + 'Claim%20Form.pdf'
      }
    ];

    $scope.feeScheduleUrl = api.contentLink(
        '/dealer/feeschedule/FeeSchedule',
        {}
      );
  });
