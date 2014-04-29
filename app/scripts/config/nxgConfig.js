'use strict';

angular.module('nextgearWebApp')
  .factory('nxgConfig', function(){


    // Test
    var apiDomain = 'https://test.discoverdsc.com';
    var segmentIoKey = 'sb06a2jbvj';
    var timeoutMs = 3600000; // 60 minutes
    var qualarooDomainCode = 'brC';

    // Local
//    var qualarooDomainCode = 'boa'; // for the survey shown for localhost

    // Training (Hotfix Testbed)
//    var apiDomain = 'https://training.discoverdsc.com';
//    var segmentIoKey = 'sb06a2jbvj';
//    var timeoutMs = 900000; // 15 minutes
//    var qualarooDomainCode = 'brC';

    // Production
//    var apiDomain = 'https://customer.nextgearcapital.com';
//    var segmentIoKey = '9eaffv4cbe';
//    var timeoutMs = 900000; // 15 minutes
//    var qualarooDomainCode = 'bmV';

    return {
      apiBase: apiDomain + '/MobileService/api',
      apiDomain: apiDomain,
      segmentIoKey: segmentIoKey,
      userVoice: {
        dealerApiKey: 'P3imRq4ZCgWgrh0XuqHyrA',
        dealerForumId: 227793,
        dealerCustomTemplateId: 21815,
        auctionApiKey: 'WqAjMXsGO7Fj57N6sQ4Cw',
        auctionForumId: 229017,
        auctionCustomTemplateId: 23042
      },
      qualarooSurvey: {
        apiKey: 52803,
        domainCode: qualarooDomainCode
      },
      infiniteScrollingMax: 500,
      sessionTimeoutMs: timeoutMs
    };
  });
