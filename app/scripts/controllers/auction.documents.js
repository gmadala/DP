'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope, metric) {
    $scope.metric = metric; // make metric names available to templates

    $scope.documents = [
      {
        title: 'Welcome Packet (PDF)',
        url: 'documents/DSC%20Welcome%20Packet.pdf'
      },
      {
        title: 'Instructions for Sellers (PDF)',
        url: 'documents/DSC%20Website%20Guide%20-%20Sellers.pdf'
      }
    ];
  });
