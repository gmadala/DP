'use strict';

angular.module('nextgearWebApp')
  .factory('nxgConfig', function(){

    var prv = {
      generateConfig: function (apiDomain, segmentIoKey, qualarooDomainCode, timeoutMs, isDemo) {
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
          sessionTimeoutMs: timeoutMs,
          isDemo: isDemo || false // default to false
        };
      },
      profile: {
        DEMO: 'demo',
        TEST: 'test',
        LOCAL: 'local',
        TRAINING: 'training',
        PRODUCTION: 'production'
      },
      getConfig: function(profile) {
        var config;
        switch (profile) {
        case prv.profile.DEMO:
          config = prv.generateConfig('https://test.discoverdsc.com', null, null, 900000 /*15 minutes*/, true /*isDemo*/);
          break;
        case prv.profile.TEST:
          config = prv.generateConfig('https://test.discoverdsc.com', 'sb06a2jbvj', 'brC', 3600000 /*60 minutes*/);
          break;
        case prv.profile.LOCAL:
          config = prv.generateConfig('https://test.discoverdsc.com', 'sb06a2jbvj', 'boa', 3600000 /*60 minutes*/);
          break;
        case prv.profile.TRAINING:
          config = prv.generateConfig('https://training.discoverdsc.com', 'sb06a2jbvj', 'brC', 900000 /*15 minutes*/);
          break;
        case prv.profile.PRODUCTION:
          config = prv.generateConfig('https://customer.nextgearcapital.com', '9eaffv4cbe', 'bmV', 900000 /*15 minutes*/);
          break;
        default:
          throw 'nxgConfig profile \'' + profile + '\' not found!';
        }
        return config;
      }
    };

    return prv.getConfig(prv.profile.DEMO);

    // Demo
//    return generateConfig('https://test.discoverdsc.com', null, null, 900000 /*15 minutes*/, true /*isDemo*/);

    // Test
//    return generateConfig('https://test.discoverdsc.com', 'sb06a2jbvj', 'brC', 3600000 /*60 minutes*/);

    // Local
//    return generateConfig('https://test.discoverdsc.com', 'sb06a2jbvj', 'boa', 3600000 /*60 minutes*/);

    // Training (Hotfix Testbed)
//    return generateConfig('https://training.discoverdsc.com', 'sb06a2jbvj', 'brC', 900000 /*15 minutes*/);

    // Production
//    return generateConfig('https://customer.nextgearcapital.com', '9eaffv4cbe', 'bmV', 900000 /*15 minutes*/);

  });
