'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    apiBase: 'http://test.discoverdsc.com/MobileService/api',
    segmentIoKey: 'sb06a2jbvj', // production: '9eaffv4cbe', test: 'sb06a2jbvj'
    infiniteScrollingMax: 500,
    showReloadWarning: true
  });
