'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    // Test
    apiBase: 'https://test.discoverdsc.com/MobileService/api',
    segmentIoKey: 'sb06a2jbvj',

    // Training (Hotfix Testbed)
    //apiBase: 'https://training.discoverdsc.com/MobileService/api',
    //segmentIoKey: 'sb06a2jbvj',

    // Production
    //apiBase: 'https://customer.nextgearcapital.com/MobileService/api',
    //segmentIoKey: '9eaffv4cbe',

    infiniteScrollingMax: 500,
    showReloadWarning: true
  });
