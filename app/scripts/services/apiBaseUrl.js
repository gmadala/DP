'use strict';

angular.module('nextgearWebApp')
	.service('apiBaseUrl', function apiBaseUrl() {
		var _apiBaseUrl = 'http://test.discoverdsc.com/MobileService/api';
		return {
			get: function() { return _apiBaseUrl; },
			set: function(url) { _apiBaseUrl = url; }
		};
	});
