'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api) {
    $scope.documents = [
      { 'title': 'Welcome Packet (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Vehicle Verification Checklist (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Instructions for Buyers (PDF)',
        'url': 'path/to/link'
      }
    ];

    $scope.collateralProtection = [
      { 'title': 'Welcome Letter (Word Doc)',
        'url': 'path/to/link'
      },
      { 'title': 'Guidelines (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Information Sheet (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Claim Form (Word Doc)',
        'url': 'path/to/link'
      }
    ];

    $scope.feeScheduleUrl = api.contentLink(
        'dealer/feeschedule',
        {}
      );
  });
