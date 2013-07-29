'use strict';

angular.module('nextgearWebApp')
  .service('apiBaseUrl', function apiBaseUrl() {
  	var apiBaseUrl = 'http://test.discoverdsc.com/MobileService/api';
  	return {
  		get: function() { return apiBaseUrl; },
  		set: function(url) { apiBaseUrl = url; }
  	};
  });
