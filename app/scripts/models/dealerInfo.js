"use strict";

angular.module('nextgearWebApp')
  .factory('DealerInfo', function($resource, apiBaseUrl) {

      var DealerInfo = $resource(apiBaseUrl.get() + '/Dealer/Info/');

      return DealerInfo;
  });
