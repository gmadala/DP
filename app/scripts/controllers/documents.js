'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api, metric, segmentio, gettextCatalog) {
    segmentio.track(metric.VIEW_RESOURCES_PAGE);
    $scope.metric = metric; // make metric names available to templates

    $scope.documents = [
      {
        title: gettextCatalog.getString('Welcome Packet (PDF)'),
        url: 'documents/NextGear%20Capital%20Welcome%20Packet.pdf'
      },
      {
        title: gettextCatalog.getString('Dealer Funding Checklist (PDF)'),
        url: 'documents/Dealer%20Funding%20Checklist.pdf'
      },
      {
        title: gettextCatalog.getString('Instructions for Buyers (PDF)'),
        url: 'documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf'
      }
    ];

    $scope.collateralProtection = [
      {
        title: gettextCatalog.getString('Welcome Letter (Word Doc)'),
        url: 'documents/WelcomeLetter.doc'
      },
      {
        title: gettextCatalog.getString('Guidelines (PDF)'),
        url: 'documents/InsuranceGuidelines.pdf'
      },
      {
        title: gettextCatalog.getString('Information Sheet (PDF)'),
        url: 'documents/InformationSheet.pdf'
      },
      {
        title: gettextCatalog.getString('Claim Form (Word Doc)'),
        url: 'documents/ClaimForm.doc'
      }
    ];

    $scope.feeScheduleUrl = api.contentLink(
        '/dealer/feeschedule/FeeSchedule',
        {}
      );
  });
