'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope, metric, gettextCatalog) {
    $scope.metric = metric; // make metric names available to templates

    $scope.documents = [
      {
        title: gettextCatalog.getString('Welcome Packet (PDF)'),
        url: 'documents/NextGear%20Capital%20Welcome%20Packet.pdf'
      },
      {
        title: gettextCatalog.getString('Instructions for Sellers (PDF)'),
        url: 'documents/NextGear%20Capital%20Website%20Guide%20-%20Sellers.pdf'
      }
    ];
  });
