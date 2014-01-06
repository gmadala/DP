'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    // Test
    apiBase: 'https://test.discoverdsc.com/MobileService/api',
    apiDomain: 'test.discoverdsc.com',
    segmentIoKey: 'sb06a2jbvj',

    // Training (Hotfix Testbed)
    //apiBase: 'https://training.discoverdsc.com/MobileService/api',
    //apiDomain: 'training.discoverdsc.com',
    //segmentIoKey: 'sb06a2jbvj',

    // Production
    //apiBase: 'https://customer.nextgearcapital.com/MobileService/api',
    //apiDomain: 'customer.nextgearcapital.com',
    //segmentIoKey: '9eaffv4cbe',

    infiniteScrollingMax: 500
  });
