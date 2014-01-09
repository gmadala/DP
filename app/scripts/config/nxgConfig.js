'use strict';

angular.module('nextgearWebApp')
  .factory('nxgConfig', function(){

    // Test
    var apiDomain = 'https://test.discoverdsc.com';
    var segmentIoKey = 'sb06a2jbvj';

    // Training (Hotfix Testbed)
    //var apiDomain = 'https://training.discoverdsc.com';
    //var segmentIoKey = 'sb06a2jbvj';

    // Production
    //var apiDomain = 'https://customer.nextgearcapital.com';
    //var segmentIoKey = '9eaffv4cbe';

    return {
        apiBase: apiDomain + '/MobileService/api',
        apiDomain: apiDomain,
        segmentIoKey: segmentIoKey,
        infiniteScrollingMax: 500
      };
  });
