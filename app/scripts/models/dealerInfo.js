"use strict";

angular.module('nextgearWebApp')
  .factory('DealerInfo', function($resource, nxgConfig) {

      var DealerInfo = $resource(nxgConfig.apiBase + '/Dealer/Info/');

      return DealerInfo;
  });
