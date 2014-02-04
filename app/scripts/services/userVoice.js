'use strict';

angular.module('nextgearWebApp')
  .factory('UserVoice', function ($window, nxgConfig) {

    return {
      init: function (apiKey, ssoToken, isDealer, BusinessNumber, BusinessName) {
        var api = this.getAPI();
        var uv=document.createElement('script');
        uv.type='text/javascript';
        uv.async=true;
        uv.src='//widget.uservoice.com/'+apiKey+'.js';
        var s=document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv,s);

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
          'support_tab_name': 'Technical Support',
          'tab_label': 'Feedback & Support',
          'tab_color': '#135889',
          'tab_position': 'middle-right',
          'tab_inverted': false
        }]);

        return api;
      },
      getAPI: function () {
        $window.UserVoice = $window.UserVoice || [];
        return $window.UserVoice;
      }
    };

  });
