'use strict';

angular.module('nextgearWebApp')
  .factory('UserVoice', function ($window) {

    return {
      init: function (apiKey) {
        var api = this.getAPI();
        var uv=document.createElement('script');
        uv.type='text/javascript';
        uv.async=true;
        uv.src='//widget.uservoice.com/'+apiKey+'.js';
        var s=document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv,s);
        return api;
      },
      getAPI: function () {
        $window.UserVoice = $window.UserVoice || [];
        return $window.UserVoice;
      }
    };

  });
