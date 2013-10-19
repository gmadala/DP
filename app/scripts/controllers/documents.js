'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api) {
    $scope.documents = [
      {
        title: 'Welcome Packet (PDF)',
        url: 'documents/DSC%20Welcome%20Packet.pdf'
      },
      {
        title: 'Vehicle Verification Checklist (PDF)',
        url: 'documents/DSC%20Vehicle%20Verification%20Checklist.pdf'
      },
      {
        title: 'Instructions for Buyers (PDF)',
        url: 'documents/DSC%20Website%20Guide%20-%20Buyers.pdf'
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
        '/dealer/feeschedule',
        {}
      );
  });
