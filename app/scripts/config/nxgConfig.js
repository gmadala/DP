'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    apiBase: 'https://test.discoverdsc.com/MobileService/api',
    //apiBase: 'https://customer.nextgearcapital.com/MobileService/api',  // Production
    segmentIoKey: 'sb06a2jbvj', // production: '9eaffv4cbe', test: 'sb06a2jbvj'
    infiniteScrollingMax: 500,
    showReloadWarning: true
  });
