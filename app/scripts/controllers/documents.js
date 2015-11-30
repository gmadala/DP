'use strict';

angular.module('nextgearWebApp')
  .controller('DocumentsCtrl', function ($scope, $dialog, api, metric, segmentio, gettextCatalog, User, kissMetricInfo) {

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
    
    $scope.documents = [] ;

    if (isUnitedStates){
      $scope.documents.push({
        title: gettextCatalog.getString('Welcome Packet'),
        url: 'http://www.nextgearcapital.com/welcome-packet/',
        metric: metric.DEALER_RESOURCES_WELCOME_PACKET_PAGE
      });

      $scope.documents.push({
        title: gettextCatalog.getString('Dealer Funding Checklist'),
        url: 'documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf',
        metric: metric.DEALER_RESOURCES_DEALER_FUNDING_CHECKLIST_PAGE
      });
    }

    $scope.documents.push({
      title: gettextCatalog.getString('Instructions for Buyers'),
      url: 'documents/' + languagePrefix + 'NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf',
      metric: metric.DEALER_RESOURCES_INSTRUCTIONS_FOR_BUYERS_PAGE
    });

    $scope.collateralProtection = [
      {
        title: gettextCatalog.getString('Welcome Letter'),
        url: 'documents/' + languagePrefix + 'Welcome%20Letter.pdf',
        metric: metric.DEALER_RESOURCES_WELCOME_LETTER_PAGE
      },
      {
        title: gettextCatalog.getString('Guidelines'),
        url: 'documents/' + languagePrefix + 'Insurance%20Guidelines.pdf',
        metric: metric.DEALER_RESOURCES_GUIDELINES_PAGE
      },
      {
        title: gettextCatalog.getString('Information Sheet'),
        url: 'documents/' + languagePrefix + 'Information%20Sheet.pdf',
        metric: metric.DEALER_RESOURCES_INFORMATION_SHEET_PAGE
      },
      {
        title: gettextCatalog.getString('Claim Form'),
        url: 'documents/' + languagePrefix + 'Claim%20Form.pdf',
        metric: metric.DEALER_RESOURCES_CLAIM_FORM_PAGE
      }
    ];

    kissMetricInfo.getKissMetricInfo().then(function(result){
        $scope.kissMetricData = result;
      });

    $scope.feeScheduleUrl = api.contentLink(
        '/dealer/feeschedule/FeeSchedule',
        {}
      );
  });
