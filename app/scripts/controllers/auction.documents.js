'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope, metric) {
    $scope.metric = metric; // make metric names available to templates

    $scope.documents = [
      { 'title': 'Welcome Packet (PDF)',
        'url': 'path/to/link'
      },
      { 'title': 'Instructions for Sellers (PDF)',
        'url': 'path/to/link'
      }
    ];
  });
