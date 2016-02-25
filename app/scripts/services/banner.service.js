'use strict';

angular.module('nextgearWebApp')
  .factory('banner', function($rootScope, $http, $state, nxgConfig, language) {

    return {
      fetch: function(callback) {

        var bannerLocation = nxgConfig.apiDomain + '/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg';

        var httpConfig = {
          method: 'GET',
          url: bannerLocation,
          params: {
            lang: language.getCurrentLanguageId()
          }
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
            // $state.transitionTo('maintenance');
          }
        );
      }
    };
  });
