'use strict';

angular.module('nextgearWebApp')
  .factory('nxgConfig', function(){

    // Test
    var apiDomain = 'https://test.discoverdsc.com';
    var segmentIoKey = 'sb06a2jbvj';
    var timeoutMs = 3600000; // 60 minutes

    // Training (Hotfix Testbed)
//    var apiDomain = 'https://training.discoverdsc.com';
//    var segmentIoKey = 'sb06a2jbvj';
//    var timeoutMs = 900000; // 15 minutes

    // Production
//    var apiDomain = 'https://customer.nextgearcapital.com';
//    var segmentIoKey = '9eaffv4cbe';
//    var timeoutMs = 900000; // 15 minutes

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
      infiniteScrollingMax: 500,
      sessionTimeoutMs: timeoutMs
    };
  });
