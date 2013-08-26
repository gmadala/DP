'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope) {
    $scope.foo = '';
    $scope.documents = [
      { 'title': 'Welcome Packet(PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Instructions for Sellers (PDF)',
        'url': 'path/to/link'
      }
    ];
  });
