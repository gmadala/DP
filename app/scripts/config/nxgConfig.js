'use strict';

angular.module('nextgearWebApp')
  .value('nxgConfig', {
    apiBase: 'https://customer.nextgearcapital.com/MobileService/api',
    segmentIoKey: '9eaffv4cbe',
    infiniteScrollingMax: 500,
    showReloadWarning: true
  });
