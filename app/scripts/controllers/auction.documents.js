'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDocumentsCtrl', function($scope, gettextCatalog, User, segmentio, metric, kissMetricInfo) {

    kissMetricInfo.getKissMetricInfo().then(
      function(result){
        segmentio.track(metric.VIEW_RESOURCES_PAGE, result);
      }
    );

    var languagePrefix = '';
    var isUnitedStates = User.isUnitedStates();
    var currentLanguage = gettextCatalog.currentLanguage;
    if (!isUnitedStates) {
      if (currentLanguage === 'fr_CA') {
        languagePrefix = 'CAF%20';
      } else {
        languagePrefix = 'CAE%20';
      }
    } else {
      if (currentLanguage === 'es') {
        languagePrefix = 'ES%20';
      }
    }

    kissMetricInfo.getKissMetricInfo().then(function(result){
      $scope.kissMetricData = result;
    });

    $scope.documents = [] ;

    if (isUnitedStates){
      $scope.documents.push({
        title: gettextCatalog.getString('Instructions for Sellers'),
        url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Website%20Guide%20-%20Sellers.pdf',
        metric: metric.AUCTION_RESOURCES_INSTRUCTIONS_FOR_SELLERS_PAGE
      });
    }
  });
