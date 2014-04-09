'use strict';

angular.module('nextgearWebApp')
  .factory('QualarooSurvey', function ($window) {

    return {
      init: function(apiKey, isDealer) {
        var q = document.createElement('script');
        q.type = 'text/javascript';
        q.async = true;
        q.src = '//s3.amazonaws.com/ki.js/' + apiKey + '/boa.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(q, s);

        var api = this.getAPI();

        api.push(['set', { 'user_is_dealer': isDealer ? 'yes' : 'no'}]);
      },
      getAPI: function() {
        $window._kiq = $window._kiq || [];
        return $window._kiq;
      }
    };
  });
