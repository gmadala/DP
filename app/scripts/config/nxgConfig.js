'use strict';

angular.module('nextgearWebApp')
  .factory('nxgConfig', function ($location) {

    var SIXTY_MINUTES = 60 * 60 * 1000;
    var FIFTEEN_MINUTES = 15 * 60 * 1000;

    var SEGMENT_KEY_UAT = 'bw2QaHkMIcEiOyWB05un7LxoDPHjLigp';
    var SEGMENT_KEY_DEMO = 'u6uZuH8MgCfZEV7wBBgVheRBL67bWZkQ';
    var SEGMENT_KEY_TEST = 'tkJXmFd2GlRCEvU96xJXWPvh2LCFgVdx';
    var SEGMENT_KEY_TRAINING = '2uofWGF1e5Bkd18gE2B7LahCnGV8PQaX';
    var SEGMENT_KEY_PRODUCTION = '9eaffv4cbe';

    var prv = {
      generateConfig: function (segmentIoKey, timeoutMs, isDemo, serviceName) {
        if (!serviceName) {
          serviceName = 'MobileService';
        }
        var apiDomain = 'https://' + $location.host();
        return {
          apiBase: apiDomain + '/' + serviceName + '/api',
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
          sessionTimeoutMs: timeoutMs,
          isDemo: isDemo || false // default to false
        };
      },
      profile: {
        LOCAL: 'local',
        LOCAL_TEST: 'local_test',
        UAT: 'uat',
        DEMO: 'demo',
        TEST: 'test',
        TRAINING: 'training',
        PRODUCTION: 'production'
      },
      getConfig: function (profile) {
        var config;
        var isDemo = profile === prv.profile.DEMO;
        switch (profile) {
          case prv.profile.LOCAL:
            config = prv.generateConfig(SEGMENT_KEY_TEST, FIFTEEN_MINUTES, isDemo);
            config.apiBase = '';
            config.apiDomain = '';
            break;
          case prv.profile.LOCAL_TEST:
            config = prv.generateConfig(SEGMENT_KEY_TEST, FIFTEEN_MINUTES, isDemo);
            config.apiBase = 'https://test.nextgearcapital.com/mobileservice/api';
            config.apiDomain = 'https://test.nextgearcapital.com';
            break;
          case prv.profile.UAT:
            config = prv.generateConfig(SEGMENT_KEY_UAT, FIFTEEN_MINUTES, isDemo);
            config.apiBase = 'https://exp1uatdapp01.nextgearcapital.com/mobileservice/api/';
            config.apiDomain = 'https://exp1uatdapp01.nextgearcapital.com/';
            break;
          case prv.profile.DEMO:
            config = prv.generateConfig(SEGMENT_KEY_DEMO, SIXTY_MINUTES, isDemo);
            break;
          case prv.profile.TEST:
            config = prv.generateConfig(SEGMENT_KEY_TEST, SIXTY_MINUTES, isDemo);
            break;
          case prv.profile.TRAINING:
            config = prv.generateConfig(SEGMENT_KEY_TRAINING, FIFTEEN_MINUTES, isDemo);
            break;
          case prv.profile.PRODUCTION:
            config = prv.generateConfig(SEGMENT_KEY_PRODUCTION, FIFTEEN_MINUTES, isDemo);
            break;
          default:
            throw 'nxgConfig profile \'' + profile + '\' not found!';
        }
        return config;
      }
    };

    var profile;

    // @if ENV='local'
    profile = prv.profile.LOCAL;
    // @endif

    // @if ENV='local_test'
    profile = prv.profile.LOCAL_TEST;
    // @endif

    // @if ENV='uat'
    profile = prv.profile.UAT;
    // @endif

    // @if ENV='demo'
    profile = prv.profile.DEMO;
    // @endif

    // @if ENV='training'
    profile = prv.profile.TRAINING;
    // @endif

    // @if ENV='production'
    profile = prv.profile.PRODUCTION;
    // @endif

    /**
     * The Test entry needs to happen at the end because when we run locally we
     * don't do a full build and we don't evaluate the conditional ENV statements.
     * So the last assignment when running locally should be test so it defaults to it.
     */
    // @if ENV='test'
    profile = prv.profile.TEST;
    // @endif

    return prv.getConfig(profile);
  });
