'use strict';

angular.module('nextgearWebApp')
  .factory('QualarooSurvey', function ($window) {

    return {
      init: function(apiKey, isDealer, BusinessNumber, BusinessName) {
        var q = document.createElement('script');
        q.type = 'text/javascript';
        q.async = true;
        q.src = '//s3.amazonaws.com/ki.js/' + apiKey + '/boa.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(q, s);

        var api = this.getAPI();

        // Send user type as custom property to allow for the survey to be shown conditionally by user type
        api.push(['set', { 'user_is_dealer': isDealer ? 'yes' : 'no'}]);

        // Identify the user
        api.push(['identify', BusinessNumber + ' - ' + BusinessName]);

      },
      getAPI: function() {
        $window._kiq = $window._kiq || [];
        return $window._kiq;
      }
    };
  });
