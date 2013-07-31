"use strict";

angular.module('nextgearWebApp')
  .service('DealerInfo', function(api) {
      var info = null;

      function refreshInfo() {
          info = api.request('GET', '/Dealer/Info/');
          return info;
      }

      return {
          isLogged: false,
          info: info,
          refreshInfo: refreshInfo
      }
  });
