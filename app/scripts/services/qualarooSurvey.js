'use strict';

angular.module('nextgearWebApp')
  .factory('QualarooSurvey', function () {

    return {
      init: function(apiKey) {
        var q = document.createElement('script');
        q.type = 'text/javascript';
        q.async = true;
        q.src = '//s3.amazonaws.com/ki.js/' + apiKey + '/boa.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(q, s);
      }
    };
  });
