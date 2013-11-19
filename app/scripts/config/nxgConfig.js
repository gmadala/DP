'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    apiBase: 'https://test.discoverdsc.com/MobileService/api',
    //apiBase: 'https://customer.nextgearcapital.com/MobileService/api',  // Production
    segmentIoKey: '9eaffv4cbe',
    infiniteScrollingMax: 500,
    showReloadWarning: true
  });
