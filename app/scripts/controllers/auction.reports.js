'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionReportsCtrl', function($scope) {
    $scope.documents = [
      { 'title': 'Credit Availability Query History (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Receivable Detail (PDF)',
        'url': 'path/to/link'
      }
    ];
  });
