'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api, metric, segmentio) {
    segmentio.track(metric.VIEW_RESOURCES_PAGE);
    $scope.metric = metric; // make metric names available to templates

    $scope.documents = [
      {
        title: 'Welcome Packet (PDF)',
        url: 'documents/NextGear%20Capital%20Welcome%20Packet.pdf'
      },
      {
        title: 'Dealer Funding Checklist (PDF)',
        url: 'documents/Dealer%20Funding%20Checklist.pdf'
      },
      {
        title: 'Instructions for Buyers (PDF)',
        url: 'documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf'
      }
    ];

    $scope.collateralProtection = [
      {
        title: 'Welcome Letter (Word Doc)',
        url: 'documents/WelcomeLetter.doc'
      },
      {
        title: 'Guidelines (PDF)',
        url: 'documents/InsuranceGuidelines.pdf'
      },
      {
        title: 'Information Sheet (PDF)',
        url: 'documents/InformationSheet.pdf'
      },
      {
        title: 'Claim Form (Word Doc)',
        url: 'documents/ClaimForm.doc'
      }
    ];

    $scope.feeScheduleUrl = api.contentLink(
        '/dealer/feeschedule/FeeSchedule',
        {}
      );
  });
