/**
 * Simple proxy to allow nextgearWebCommon to start using the API.
 * The actual 'api' service in each project will have to call apiCommon.init(service) to inject itself into this
 * service. This may need to be modified later but should be good enough to get started using it.
 */

'use strict';

angular.module('nextgearWebCommon')
  .factory('apiCommon', function () {
    var api;
    var service = {
      init: function init(appApi) { api = appApi; },
      request: function() { return api.request.apply(api, arguments); }
    };

    return service;
  });
