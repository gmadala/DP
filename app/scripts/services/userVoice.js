'use strict';

angular.module('nextgearWebApp')
  .factory('UserVoice', function ($window) {

    return {
      init: function (apiKey, BusinessNumber, BusinessName) {
        var api = this.getAPI();
        var uv=document.createElement('script');
        uv.type='text/javascript';
        uv.async=true;
        uv.src='//widget.uservoice.com/'+apiKey+'.js';
        var s=document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv,s);

        // setup account traits
        api.push(['identify', {
          account: {
            id: BusinessNumber,
            name: BusinessName
          }
        }]);

        return api;
      },
      getAPI: function () {
        $window.UserVoice = $window.UserVoice || [];
        return $window.UserVoice;
      }
    };

  });
