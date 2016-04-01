(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('UserVoice', UserVoice);

  UserVoice.$inject = ['$window', 'nxgConfig', 'gettextCatalog'];

  function UserVoice($window, nxgConfig, gettextCatalog) {

    return {
      init: function (apiKey, ssoToken, isDealer, BusinessNumber, BusinessName) {
        var uv=document.createElement('script');
        uv.type='text/javascript';
        uv.async=true;
        uv.src='//widget.uservoice.com/'+apiKey+'.js';
        var s=document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv,s);

        /**
         * IE will execute the above script as soon as it finds it,
         * so if it is cached, it will be run before we push our info into the api object,
         * which prevents the UV tab and widget from being created.
         *
         * To fix, we create the api variable here, AFTER the script tag is inserted.
         */
        var api = this.getAPI();

        var config = nxgConfig.userVoice,
        // check user type, dealers and auctions will have different subdomains to go to
          forumId = isDealer ? config.dealerForumId : config.auctionForumId,
          customTemplateId = isDealer ? config.dealerCustomTemplateId : config.auctionCustomTemplateId;

        // setup account traits
        api.push(['identify', {
          account: {
            id: BusinessNumber,
            name: BusinessName
          }
        }]);

        // set SSO token
        api.push(['setSSO', ssoToken]);

        // setup the feedback widget
        api.push(['showTab', 'classic_widget', {
          'mode': 'full',
          'primary_color': '#135889', // $brand
          'link_color': '#1864A1', // $brand-text
          'default_mode': 'support',
          'forum_id': forumId,
          'custom_template_id': customTemplateId, // custom stylesheet editable on <subdomain>.uservoice.com/admin
          'support_tab_name': gettextCatalog.getString('Technical Support'),
          'tab_label': gettextCatalog.getString('Feedback & Support'),
          'tab_color': '#135889',
          'tab_position': 'middle-left',
          'tab_inverted': false
        }]);

        return api;
      },
      getAPI: function () {
        $window.UserVoice = $window.UserVoice || [];
        return $window.UserVoice;
      }
    };

  }
})();
