'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api, metric, segmentio, gettextCatalog) {
    segmentio.track(metric.VIEW_RESOURCES_PAGE);
    $scope.metric = metric; // make metric names available to templates

    var languagePrefix = '';

    if (gettextCatalog.currentLanguage === 'fr_CA') {
      languagePrefix = 'CAF_';
    }
    else if (false /* TODO: User is English Canadian */) {
      languagePrefix = 'CAE_';
    }

    $scope.documents = [
      {
        title: gettextCatalog.getString('Welcome Packet (PDF)'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Welcome%20Packet.pdf'
      },
      {
        title: gettextCatalog.getString('Dealer Funding Checklist (PDF)'),
        url: 'documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf'
      },
      {
        title: gettextCatalog.getString('Instructions for Buyers (PDF)'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf'
      }
    ];

    $scope.collateralProtection = [
      {
        title: gettextCatalog.getString('Welcome Letter (Word Doc)'),
        url: 'documents/' + languagePrefix + 'WelcomeLetter.doc'
      },
      {
        title: gettextCatalog.getString('Guidelines (PDF)'),
        url: 'documents/' + languagePrefix + 'InsuranceGuidelines.pdf'
      },
      {
        title: gettextCatalog.getString('Information Sheet (PDF)'),
        url: 'documents/' + languagePrefix + 'InformationSheet.pdf'
      },
      {
        title: gettextCatalog.getString('Claim Form (Word Doc)'),
        url: 'documents/' + languagePrefix + 'ClaimForm.doc'
      }
    ];

    $scope.feeScheduleUrl = api.contentLink(
        '/dealer/feeschedule/FeeSchedule',
        {}
      );
  });
