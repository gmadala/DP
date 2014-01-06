'use strict';

angular.module('nextgearWebApp')
  .factory('banner', function($rootScope, $http, nxgConfig) {

    return {
      fetch: function(callback) {

        var domain = '';

        // Only add 'http://' when calling API, not when using mock data
        if(nxgConfig.apiDomain.length > 0){
          domain = 'http://' + nxgConfig.apiDomain;
        }

        var bannerLocation = domain + '/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg';

        var httpConfig = {
          method: 'GET',
          url: bannerLocation
        };

        $http(httpConfig).then(
          function(response) {
            if (response.status === 200 && response.data.Data && response.data.Data[0]) {
              callback(response.data.Data[0].Message);
            } else {
              callback('');
            }
          },
          function(/*error*/) {
            callback('');
          }
        );
      }
    };
  });
