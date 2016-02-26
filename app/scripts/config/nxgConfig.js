(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('nxgConfig', nxgConfig);

  function nxgConfig() {

    var SIXTY_MINUTES = 60 * 60 * 1000;
    var FIFTEEN_MINUTES = 15 * 60 * 1000;

    var SEGMENT_KEY_UAT = 'bw2QaHkMIcEiOyWB05un7LxoDPHjLigp';
    var SEGMENT_KEY_DEMO = 'u6uZuH8MgCfZEV7wBBgVheRBL67bWZkQ';
    var SEGMENT_KEY_TEST = 'tkJXmFd2GlRCEvU96xJXWPvh2LCFgVdx';
    var SEGMENT_KEY_TRAINING = '2uofWGF1e5Bkd18gE2B7LahCnGV8PQaX';
    var SEGMENT_KEY_PRODUCTION = '9eaffv4cbe';

    var prv = {
      profile: {
        LOCAL: 'local',
        LOCAL_TEST: 'local_test',
        UAT: 'uat',
        DEMO: 'demo',
        TEST: 'test',
        TRAINING: 'training',
        PRODUCTION: 'production'
      },
      generateConfig: generateConfig,
      getConfig: getConfig
    };

    /**
     * Get configuration for specific configuration profile.
     * @param profile the configuration profile which will be used.
     * @returns {*} the configuration object for the specified profile.
     */
    function getConfig(profile) {

      var config;
      var apiDomain;
      var ngenDomain;

      var isDemo = profile === prv.profile.DEMO;
      switch (profile) {
        case prv.profile.LOCAL:
          apiDomain = '';
          ngenDomain = '';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_TEST, FIFTEEN_MINUTES, isDemo);
          break;
        case prv.profile.LOCAL_TEST:
          apiDomain = 'https://test.nextgearcapital.com';
          ngenDomain = 'https://localhost:8080';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_TEST, FIFTEEN_MINUTES, isDemo);
          break;
        case prv.profile.UAT:
          apiDomain = 'https://exp1uatdapp01.nextgearcapital.com/';
          ngenDomain = 'https://ngen-api.uat.nextgearcapital.com';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_UAT, FIFTEEN_MINUTES, isDemo);
          break;
        case prv.profile.DEMO:
          apiDomain = 'https://demo.nextgearcapital.com';
          ngenDomain = 'https://dis-demo-ngen-api.nextgearcapital.com/';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_DEMO, SIXTY_MINUTES, isDemo);
          break;
        case prv.profile.TEST:
          apiDomain = 'https://test.nextgearcapital.com';
          ngenDomain = 'https://ngen-api1.uat.nextgearcapital.com/';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_TEST, SIXTY_MINUTES, isDemo);
          break;
        case prv.profile.TRAINING:
          apiDomain = 'https://training.nextgearcapital.com';
          ngenDomain = 'https://dis-training-ngen-api.nextgearcapital.com/';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_TRAINING, FIFTEEN_MINUTES, isDemo);
          break;
        case prv.profile.PRODUCTION:
          apiDomain = 'https://customer.nextgearcapital.com';
          ngenDomain = 'https://ngen-api.nextgearcapital.com';
          config = prv.generateConfig(apiDomain, ngenDomain, SEGMENT_KEY_PRODUCTION, FIFTEEN_MINUTES, isDemo);
          break;
        default:
          throw 'nxgConfig profile \'' + profile + '\' not found!';
      }
      return config;
    }

    /**
     * Generate web configuration based on the parameters.
     *
     * @param apiDomain
     * @param segmentIoKey
     * @param timeoutMs
     * @param isDemo
     */
    function generateConfig(apiDomain, ngenDomain, segmentIoKey, timeoutMs, isDemo) {
      var configuration;
      configuration = {
        apiBase: apiDomain + '/MobileService/api',
        apiDomain: apiDomain,
        ngenDomain: ngenDomain,
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
      return configuration;
    }

    /**
     * Grunt will process the following lines of code depending on the ENV option value passed when building the web.
     * See: https://github.com/jsoverson/grunt-preprocess
     */
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
  }
})();
